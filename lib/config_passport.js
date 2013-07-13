var LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

var Config = function(app, models, passport) {

  passport.use(new LocalStrategy(function(username, password, done) {
    models.Users.findOne({username: username}, function(err,user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }

      hash(password, user.salt, function (err, hash) {
        if (err) return done(err);
        if (hash == user.hash) return done(null, user);
        done(null, false, {message: 'Incorrect password.'});
      });
    });
  }));

  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.BASE_URI + "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      models.FbUsers.findOne({fbId: profile.id}, function(err, oldUser) {
        if (oldUser) {
          done(null, oldUser);
        } else {
          var newUser = new models.FbUsers({
            fbId : profile.id ,
            email : profile.emails[0].value,
            name : profile.displayName
          }).save(function(err,newUser) {
            if(err) throw err;
            done(null, newUser);
          });
        }
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    models.FbUsers.findById(id,function(err,user) {
      if (err) done(err);
      if (user){
        done(null, user);
      }else{
        models.Users.findById(id, function(err,user) {
          if (err) done(err);
          done(null, user);
        });
      }
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

exports.config = Config;