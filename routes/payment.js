const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const passport = require('passport')

router.get('/', checkAuthenticated, (req, res) => {
    res.render('payment/index', { user : req.user })
})

router.get('/pending', checkAuthenticated, (req, res) => {
    res.render('payment/pending', { user : req.user })
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

module.exports = router