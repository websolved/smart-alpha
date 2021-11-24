if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const productRouter = require('./routes/product')
const contractorRouter = require('./routes/contractor')
const paymentRouter = require('./routes/payment')
const regRouter = require('./routes/registration')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static('public'))
app.use(flash())
app.use(session({
    secret: (process.env.SESSION_SECRET || 'secret'),
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
//app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: false}));

app.delete('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/product', productRouter)
app.use('/contractor', contractorRouter)
app.use('/payment', paymentRouter)
app.use('/registrations', regRouter)

app.listen(process.env.PORT || 3000)