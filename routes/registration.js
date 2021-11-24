const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('../passport-config')
const Register = require('../models/register')

router.get('/', checkAuthenticated, checkAdmin, async (req, res) => {
    let query = Register.find()
    try {
        const register = await query.exec()
        res.render('registrations/index', { register: register, user : req.user })
    } catch {
        res.redirect('/')
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