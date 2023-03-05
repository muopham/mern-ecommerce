const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const dbConnect = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected"));
  } catch (error) {
    console.log("DB connect fail");
  }
};

module.exports = dbConnect;
