const UserModel = require("./database");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//secret key should be same as provided earlier in JWT-Token
opts.secretOrKey = "Random string";
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload);
    console.log("hidbroo");
    // finding out user
    UserModel.findOne({ id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);
