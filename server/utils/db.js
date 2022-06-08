const mongoose = require("mongoose");

const url =
  "mongodb+srv://W8PypVqIRJXDReMh:W8PypVqIRJXDReMh@cluster0.1nq2x.mongodb.net/socialApp?retryWrites=true&w=majority";

mongoose.connect(url).then(() => {
  console.log("database now connected...!");
});

module.exports = mongoose;
