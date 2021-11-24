const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const passport = require('passport')
const Member = require('../models/member')
const bcrypt = require('bcrypt')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//Get contractor index page 
router.get('/', checkAuthenticated, checkAdmin, async (req, res) => {
    //res.render('contractor/index', { user : req.user })
    let query = Member.find({ role:'contractor' })
    try {
        const contractor = await query.exec()
        res.render('contractor/index', { contractor: contractor, user : req.user })
    } catch {
        res.redirect('/')
    }
})

//New contractor 
router.get('/add', checkAuthenticated, checkAdmin, (req, res) => {
    renderNewPage(res, new Member(), req.user)
    //res.render('contractor/add', { user : req.user })
})

//Create Contractor
router.post('/add-contractor', checkAuthenticated, checkAdmin, async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const member = new Member({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        role: 'contractor',
        address: req.body.address,
        gst: req.body.gst,
        password: hashedPassword
    })
    saveProfileImage(member, req.body.profileimage)
    saveGstImg(member, req.body.gstimg)

    try {
        //console.log('hi')
        const newMember = await member.save()
        res.redirect('/contractor/')
    } catch {
        res.redirect('add')
    }
})

//Show Contractor Route
router.get('/:id', checkAuthenticated, checkAdmin, async (req, res) => {
    try {
        const contractor = await Member.findById(req.params.id).exec()
        res.render('contractor/view', { contractor: contractor, user: req.user })
    } catch {
        res.redirect('/')        
    }
    //res.render('contractor/view', { user : req.user })
})

//Edit Contractor Route
router.get('/edit', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('contractor/edit', { user : req.user })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    //console.log('Not Working')
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function checkAdmin(req, res, next) {
    const user = req.user
    //console.log(user)
    if(user.role == 'admin') {
        return next()
    } else {
        res.redirect('/login')
    }
}

async function renderNewPage(res, member, user, hasError = false) {
    //console.log('New Page')
    renderFormPage(res, member, 'add', user, hasError)
}
async function renderEditPage(res, member, hasError = false) {
    //console.log('New Page')
    renderFormPage(res, member, 'edit', hasError)
}

async function renderFormPage(res, member, form, user, hasError = false) {
    try {
        //const contractor = await Member.find({})
        //console.log('hi')
        const params = {
            //member: member,
            user: user
        }
        //console.log('hi')
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Contractor'
                console.log('Error Updating Contractor')
            } else {
                params.errorMessage = 'Error Creating Contractor'
                console.log('Error Creating Contractor')
            }
        }    
        //console.log(form)
        res.render(`contractor/${form}`, params)
    } catch {
        res.redirect('/contractor')
    }
}

function saveProfileImage(contractor, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        contractor.profileimage = new Buffer.from(cover.data, 'base64')
        contractor.profileImageType = cover.type
    }
}

function saveGstImg(contractor, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        contractor.gstimg = new Buffer.from(cover.data, 'base64')
        contractor.gstImgType = cover.type
    }
}

module.exports = router