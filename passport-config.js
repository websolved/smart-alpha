const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt') 
const Member = require('./models/member')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await Member.findOne({ email: email}).exec()
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                //console.log('password authentication successful')
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password Incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' },
    authenticateUser))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        Member.findById(id, function(err, user) {
          done(err, user);
        });
      });
}

module.exports = initialize