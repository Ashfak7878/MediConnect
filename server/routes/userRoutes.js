const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  loginController,
  verifyOtpController,
  verify2FAController,
  resendOtpController,
  forgotPasswordController,
  resetPasswordController,
  registerController,
  authController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllApprovedDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateProfileController
} = require("../controllers/userCtrl");

const router = express.Router();const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
router.post("/login", loginController);
router.post("/verify-otp", verifyOtpController);
router.post("/verify-2fa", verify2FAController);
router.post("/resend-otp", resendOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController);
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);
router.get("/getAllDoctors", authMiddleware, getAllApprovedDoctorsController);
router.post("/book-appointment", authMiddleware, bookAppointmentController);
router.post("/booking-availability", authMiddleware, bookingAvailabilityController);router.get("/user-appointments", authMiddleware, userAppointmentsController); 
router.post("/update-profile", authMiddleware, updateProfileController); 

module.exports = router;