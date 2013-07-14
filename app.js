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
  , ObjectID = require("./node_modules/mongoose/node_modules/mongodb").ObjectID;

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

function userExist(req, res, next) {
  models.Users.count({username: req.body.username}, function (err, count) {
    if (count === 0) {
      next();
    } else {
      res.redirect("/signup");
    }
  });
}

/*
 * Routes
 */
app.get("/", routes.index);
app.get("/login", routes.login);
app.get("/signup", routes.signup);
app.get('/logout', routes.logout);
app.get('/challanges', routes.challanges);
app.get('/comparison', routes.comparison);

app.post("/login", passport.authenticate('local', {
  successRedirect : "/",
  failureRedirect : "/login",
}));

app.post("/signup", userExist, function (req, res, next) {
  var user = new models.Users();
  hash(req.body.password, function (err, salt, hash) {
    if (err) throw err;
    var user = new models.Users({
      username: req.body.username,
      salt: salt,
      hash: hash,
      _id : new ObjectID
    }).save(function (err, newUser) {
      if (err) throw err;
      req.login(newUser, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    });
  });
});

app.get("/auth/facebook", passport.authenticate("facebook",{scope: "email"}));

app.get("/auth/facebook/callback",
  passport.authenticate("facebook", {failureRedirect: '/login'}),
  function(req,res) {
    res.render("loggedin", {user: req.user});
  }
);

app.get("/profile", authenticatedOrNot, function(req, res){
  res.render("profile", { user: req.user});
});

app.post("/answer", userExist, function (req, res, next) {
  var answers = new models.Answers({
    user: req.sessionID,
    question: req.body.id
  }).save(function (err, newAnswer) {
    console.log(newAnswer);
    res.send(200);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
