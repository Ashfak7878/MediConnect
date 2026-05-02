const mongoose = require('mongoose');

const connectDB = async () => {
  try {    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1); // This stops the server if the database fails to connect
  }
};

module.exports = connectDB;