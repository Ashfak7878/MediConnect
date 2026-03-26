const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.log("Error: MONGO_URL is missing in .env file");
      return;
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected Successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error.message}`);
  }
};
connectDB();

// ROUTES (Fixed duplicate)
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes")); // <

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server Running in ${process.env.NODE_MODE || "development"} mode on port ${port}`);
});