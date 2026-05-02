const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

// Configure CORS to explicitly allow your frontend URLs
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8080",
    "https://medi-connect-inky-nine.vercel.app"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Database connection
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

// Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server Running in ${process.env.NODE_MODE || "development"} mode on port ${port}`);
});