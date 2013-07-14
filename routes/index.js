
/*
 * GET home page.
 */

exports.index = function (req, res) {
  if (req.isAuthenticated()) {
    res.render("loggedin", {user: req.user});
  } else {
    res.render('index', {title: 'Wohlo'});
  }
};

exports.signup = function (req, res) {
  res.render("signup");
};

exports.login = function (req, res) {
  res.render("login");
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};

exports.challenges = function(req, res) {
  res.render("challenges");
};

