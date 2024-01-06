const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  await mongoose.connect(process.env.DB_URL, { dbName: "provoke-notes" });
  console.log("successfully connected to mongodb");
}

module.exports = { dbConnect };
