const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllApprovedDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController // <--- This MUST be imported
} = require("../controllers/userCtrl");

const router = express.Router();

// ==========================================
// MULTER CONFIGURATION FOR CV UPLOADS
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ==========================================
// USER ROUTES
// ==========================================

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController);
router.post("/apply-doctor", authMiddleware, upload.single("cv"), applyDoctorController);
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);
router.get("/getAllDoctors", authMiddleware, getAllApprovedDoctorsController);
router.post("/book-appointment", authMiddleware, bookAppointmentController);
router.post("/booking-availability", authMiddleware, bookingAvailabilityController);

// THE MISSING ROUTE THAT FIXES THE 404:
router.get("/user-appointments", authMiddleware, userAppointmentsController); 

module.exports = router;