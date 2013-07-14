/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require("passport")

  , routes = require("./routes")
  , hash = require("./lib/pass").hash
  , models = require("./lib/models")
  , ConfigPassport = require("./lib/config_passport")
  , title = "Wohlo";

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: process.env.SESSION_SECRET}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

ConfigPassport.config(app, models, passport);

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * Helpers
 */
function authenticatedOrNot(req, res, next){
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

/*
 * Routes
 */
app.get("/", routes.index);
app.get("/login", routes.login);
app.get('/logout', routes.logout);

app.post("/login", passport.authenticate('local', {
  successRedirect : "/",
  failureRedirect : "/login",
}));

app.post("/signup", function (req, res, next) {
  hash(req.body.password, function (err, salt, hash) {
    if (err) throw err;

    var user = {
      username: req.body.username,
      salt: salt,
      hash: hash
    };

    models.Users.findOneAndUpdate({session: req.sessionID}, user, function(err, existingUser) {
      if (existingUser) {
        req.login(existingUser, function(err) {
          if (err) { return next(err); }
          return res.redirect('/challenges');
        });
      } else {
        user.session = req.sessionID;
        var user = new models.Users(user).save(function (err, newUser) {
          if (err) throw err;
          req.login(newUser, function(err) {
            if (err) { return next(err); }
            return res.redirect('/challenges');
          });
        });
      }
    });
  });
});

app.get("/auth/facebook", passport.authenticate("facebook", {scope: "email"}));
app.get("/auth/facebook/callback",
  passport.authenticate("facebook", {failureRedirect: '/login'}),
    function(req, res) {
      res.redirect("/challenges");
});

app.get("/profile", authenticatedOrNot, function(req, res){
  res.render("profile", { user: req.user});
});

app.post("/answer", function (req, res, next) {
  new models.Users({
    session: req.sessionID,
    company: req.body.company,
    score: parseInt(req.body.score * 100 / 15)
  }).save(function (err, newUser) {
    var find = {name: newUser.company}
      , update = {$inc: {score: newUser.score, user_count: 1}}
      , options = {upsert: true};

    models.Companies.findOneAndUpdate(find, update, options, function(err, company) {
      console.log(newUser);
      console.log(company);
      res.redirect("/comparison");
    });
  });
});

app.get("/comparison", function (req, res, next) {
  models.Users.findOne({session: req.sessionID}, function(err, user) {
    if (err || !user) return res.redirect("/");

    models.Companies.findOne({name: user.company}, function(err, company) {
      res.render("comparison", {title: title, user: user, company: company});
    });
  });
});

app.get('/challenges', function(req, res) {
  var data = {};
  models.Users.findById(req.session.passport.user, function(err, user) {
    if (!err && user) data = {user: user.name};
    res.render("challenges", data);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
