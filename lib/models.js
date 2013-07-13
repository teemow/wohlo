var mongoose = require("mongoose");

mongoose.connect(process.env.MONGOHQ_URL || "mongodb://localhost/wohlo");

var LocalUserSchema = new mongoose.Schema({
  username: String,
    salt: String,
    hash: String
});

exports.Users = mongoose.model('userauths', LocalUserSchema);

//Facebook Users Schema
var FacebookUserSchema = new mongoose.Schema({
  fbId: String,
  email: { type : String , lowercase : true},
  name: String
});
exports.FbUsers = mongoose.model('fbs', FacebookUserSchema);


