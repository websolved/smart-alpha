const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('../passport-config')

router.get('/', checkAuthenticated, checkAdmin, async (req, res) => {
    let query = Product.find()
    try {
        const product = await query.exec()
        res.render('product/index', { product: product, user : req.user })
    } catch {
        res.redirect('/')
    }
})

router.get('/add', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('product/add', { user : req.user })
})

router.post('/add', checkAuthenticated, checkAdmin, async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            date: new Date()
        })
        const newproduct = await product.save()
        res.redirect('/product')
    } catch {
        res.redirect('/product/add')
    }
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

module.exports = router