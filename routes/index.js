
/*
 * GET home page.
 */

exports.index = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/challenges");
  } else {
    res.render('index', {title: 'Wohlo'});
  }
};

exports.login = function (req, res) {
  res.render("login");
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

