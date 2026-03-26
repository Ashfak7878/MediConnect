const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
  toggleAbsentStatusController,
  blockUserController,
  updateDoctorProfileController
} = require("../controllers/adminCtrl");

const router = express.Router();

// ==========================================
// ADMIN ROUTES
// ==========================================

// GET || GET ALL USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// GET || GET ALL DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// POST || CHANGE ACCOUNT STATUS
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);

// POST || TOGGLE ABSENT STATUS
router.post("/toggleAbsentStatus", authMiddleware, toggleAbsentStatusController);

// POST || BLOCK USER
router.post("/blockUser", authMiddleware, blockUserController);

// POST || UPDATE DOCTOR PROFILE
router.post("/updateDoctorProfile", authMiddleware, updateDoctorProfileController);

module.exports = router;