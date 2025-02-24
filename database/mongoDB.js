const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://yashsahyashu4752:ogiXrb8U2zKiWYrz@cluster0.vjrvr.mongodb.net/chatapp?retryWrites=true&w=majority";
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
    console.log(`Host : ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error: " + error);
    process.exit(1);
  }
};

module.exports = connectDb;
