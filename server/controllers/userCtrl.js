const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

// ==========================================
// 1. REGISTER CONTROLLER
// ==========================================
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User Already Exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
  }
};

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

// ==========================================
// 3. AUTH CONTROLLER
// ==========================================
const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Auth error", success: false, error });
  }
};

// ==========================================
// 4. APPLY DOCTOR CONTROLLER (Crash-Proof)
// ==========================================
const applyDoctorController = async (req, res) => {
  try {
    if (req.file) {
      req.body.cv = req.file.path; 
    }

    if (req.body.timings && typeof req.body.timings === 'string') {
      req.body.timings = JSON.parse(req.body.timings);
    }

    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    
    if (adminUser) {
      const notification = adminUser.notification || [];
      notification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.firstName + " " + newDoctor.lastName,
          onClickPath: "/admin/doctors",
        },
      });
      await userModel.findByIdAndUpdate(adminUser._id, { notification });
    }

    res.status(201).send({ success: true, message: "Doctor Account Applied Successfully" });
  } catch (error) {
    console.log("Apply Doctor Crash:", error);
    res.status(500).send({ success: false, error, message: "Error While Applying For Doctor" });
  }
};

// ==========================================
// 5. GET ALL NOTIFICATIONS
// ==========================================
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification || [];
    const notification = user.notification || [];
    
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;
    
    const updatedUser = await user.save();
    res.status(200).send({ success: true, message: "All notifications marked as read", data: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in notification", success: false, error });
  }
};

// ==========================================
// 6. DELETE ALL NOTIFICATIONS
// ==========================================
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({ success: true, message: "Notifications Deleted successfully", data: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Unable to delete all notifications", error });
  }
};

// ==========================================
// 7. GET ALL APPROVED DOCTORS
// ==========================================
const getAllApprovedDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({ success: true, message: "Doctors Fetched Successfully", data: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error While Fetching Doctors" });
  }
};

// ==========================================
// 8. BOOK APPOINTMENT CONTROLLER
// ==========================================
const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";

    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo?.userId });
    
    if (user) {
      if (!user.notification) user.notification = [];
      user.notification.push({
        type: "New-appointment-request",
        message: `A new Appointment Request from ${req.body.userInfo?.name || "a Patient"}`,
        onClickPath: "/doctor-appointments",
      });
      await user.save();
    }

    res.status(200).send({ success: true, message: "Appointment Booked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error While Booking Appointment" });
  }
};

// ==========================================
// 9. CHECK AVAILABILITY CONTROLLER
// ==========================================
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res.status(200).send({ message: "Appointments not Available at this time", success: false });
    } else {
      return res.status(200).send({ success: true, message: "Appointments Available" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error In Booking Availability" });
  }
};

// ==========================================
// 10. GET USER APPOINTMENTS CONTROLLER
// ==========================================
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error In User Appointments" });
  }
};

// Export ALL controllers so routes don't crash!
module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllApprovedDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};