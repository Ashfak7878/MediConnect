const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  doctorAppointmentsController,
  updateStatusController,
  getDoctorByIdController, // <--- Imported the new controller here
} = require("../controllers/doctorCtrl");

const router = express.Router();

// ==========================================
// DOCTOR ROUTES
// ==========================================

// POST || GET SINGLE DOCTOR INFO (Profile)
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// POST || UPDATE DOCTOR PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

// GET || GET DOCTOR APPOINTMENTS
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);

// POST || UPDATE APPOINTMENT STATUS
router.post("/update-status", authMiddleware, updateStatusController);

// POST || GET SINGLE DOCTOR BY ID (For Booking Page)
router.post("/getDoctorById", authMiddleware, getDoctorByIdController); // <--- Added the missing route here!

module.exports = router;