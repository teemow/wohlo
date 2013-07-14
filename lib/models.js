var mongoose = require("mongoose");

mongoose.connect(process.env.MONGOHQ_URL || "mongodb://localhost/wohlo");

var UserSchema = new mongoose.Schema({
  fbId: String,
  username: String,
  salt: String,
  email: { type : String , lowercase : true},
  name: String,
  session: String,
  company: String,
  score: Number,
  hash: String
});
exports.Users = mongoose.model('users', UserSchema);

