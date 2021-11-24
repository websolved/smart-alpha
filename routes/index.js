const express = require('express')
const router = express.Router()
const Member = require('../models/member')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('../passport-config')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Register = require('../models/register')

initializePassport(
    passport,
    email => Member.find(user => user.email === email),
    id => Member.find(user => user.id === id)
)

//Get Dashboard
router.get('/', checkAuthenticated, (req, res) => {
    res.render('index', { user: req.user })
})


//Get Main Register Page
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
})

//Register page POST
router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const register = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            interest1: req.body.interest1,
            interest2: req.body.interest2,
            interest3: req.body.interest3
        })
        const newEntry = await register.save()
        res.redirect('login')
    } catch {
        res.redirect('register')
    }
})


//Get Register page for contractor
//router.get('/register-contractor', checkNotAuthenticated, (req, res) => {
//    res.render('register-contractor')
//})

//Register Contractor POST
router.post('/register-contractor', checkNotAuthenticated, async (req, res) => {
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
        res.redirect('login')
    } catch {
        res.redirect('register-contractor')
    }
})


// Add Contractor
router.post('/add-contractor', checkAuthenticated, async (req, res) => {
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
        const newMember = await member.save(function(err) {
            if(err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    // Duplicate username
                    return res.status(422).send({ succes: false, message: 'User already exist!' })
            }
        }
        })
        console.log(message.error)
        res.redirect('login')
    } catch {
        res.redirect('register-contractor')
    }
})

//Get register page for trader
router.get('/register-trader', checkNotAuthenticated, (req, res) => {
    res.render('register-trader')
})

//Register page for Trader POST
router.post('/register-trader', checkNotAuthenticated, async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const member = new Member({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        role: 'trader',
        dealsin: req.body.dealsin,
        address: req.body.address,
        gst: req.body.gst,
        password: hashedPassword
    })
    saveProfileImage(member, req.body.profileimage)
    saveGstImg(member, req.body.gstimg)

    try {
        //console.log('hi')
        const newMember = await member.save()
        //console.log(newContractor)
        res.redirect('login')
    } catch {
        res.redirect('register-contractor')
    }
})

// Get login page
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})

// Login page form POST
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

//Get profile page
router.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile', { user: req.user  })
})

// Check if Authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    //console.log('Not Working')
    res.redirect('/login')
}

//Check if not authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

//To save Profile Picture
function saveProfileImage(contractor, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        contractor.profileimage = new Buffer.from(cover.data, 'base64')
        contractor.profileImageType = cover.type
    }
}

//To save GST Picture
function saveGstImg(contractor, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        contractor.gstimg = new Buffer.from(cover.data, 'base64')
        contractor.gstImgType = cover.type
    }
}

module.exports = router