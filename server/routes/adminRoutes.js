const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createDoctorController,
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
  toggleAbsentStatusController,
  blockUserController,
  updateDoctorProfileController,
  getAdminStatsController
} = require("../controllers/adminCtrl");

const router = express.Router();

router.get("/get-admin-stats", authMiddleware, getAdminStatsController);
router.get("/getAllUsers", authMiddleware, getAllUsersController);
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);
router.post("/toggleAbsentStatus", authMiddleware, toggleAbsentStatusController);
router.post("/blockUser", authMiddleware, blockUserController);
router.post("/updateDoctorProfile", authMiddleware, updateDoctorProfileController);
router.post("/createDoctor", authMiddleware, createDoctorController);

module.exports = router;