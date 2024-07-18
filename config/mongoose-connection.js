const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(function () {
    dbgr("connected to Mongo");
  })
  .catch(function (err) {
    dbgr(err);
  });

let db = mongoose.connection;

module.exports = db;
