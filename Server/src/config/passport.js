import passport from 'passport'
var GoogleStrategy = require('passport-google-oauth20').Strategy;
import dotenv from 'dotenv'
dotenv.config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_URL,
    passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {
    try{

    }catch(error){

    }
  }
));