const mongoose = require("mongoose");

const connectDb = async () => {

  const DB_URL = process.env.DATABASE.replace('<USERNAME>', process.env.USERNAME_DB).replace('<PASSWORD>', process.env.PASSWORD_DB)

  try {
    await mongoose.connect(DB_URL);
    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDb;
