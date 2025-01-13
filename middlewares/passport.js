const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken');
const Auth = require('../models/user')

passport.use(
    new BearerStrategy(async (token, done) => {
        try {
            const decodedToken = await jwt.verify(token, process.env.JWT_SECRET); 
            const userFound = await Auth.findById(decodedToken.id);
            if (!userFound) {
                return done(null, false);
            } else {
                return done(null, userFound, { scope: "all" });
            }
        } catch (err) {
            console.log(err);
            return done(null, false);
        }
    })
)