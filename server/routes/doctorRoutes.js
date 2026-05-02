const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  doctorAppointmentsController,
  updateStatusController,
  getDoctorByIdController, // <--- Imported the new controller here
} = require("../controllers/doctorCtrl");

const router = express.Router();router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);router.post("/updateProfile", authMiddleware, updateProfileController);router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);router.post("/update-status", authMiddleware, updateStatusController);router.post("/getDoctorById", authMiddleware, getDoctorByIdController); // <--- Added the missing route here!

module.exports = router;