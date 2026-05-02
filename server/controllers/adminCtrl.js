const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const bcrypt = require("bcryptjs");const createDoctorController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, website, address, specialization, experience, feesPerConsultation, timings } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({ message: "User With This Email Already Exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: `Dr. ${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      isAdmin: false,
      isDoctor: true,
      notification: [],
      seennotification: []
    });
    const savedUser = await newUser.save();

    const newDoctor = new doctorModel({
      userId: savedUser._id.toString(),
      firstName,
      lastName,
      email,
      phone,
      website: website || '',
      address: address || '',
      specialization,
      experience,
      feesPerConsultation,
      timings,
      status: "approved"
    });
    await newDoctor.save();

    res.status(201).send({ success: true, message: "Doctor Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Failed To Create Doctor", error });
  }
};const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error,
    });
  }
};const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId, 
      { status }, 
      { new: true }
    );    const user = await userModel.findOne({ _id: doctor.userId });
    
    if (user) {
      const notification = user.notification || [];
      notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request has been ${status}`,
        onClickPath: "/notification",
      });      user.isDoctor = status === "approved" ? true : false;
      user.notification = notification;
      await user.save();
    }

    res.status(201).send({
      success: true,
      message: "Account Status Updated Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};const toggleAbsentStatusController = async (req, res) => {
  try {
    const { doctorId, isAbsent } = req.body;
    
    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { isAbsent },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: `Doctor marked as ${isAbsent ? 'Absent' : 'Available'} successfully`,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error toggling absent status",
      error,
    });
  }
};const blockUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    await userModel.findByIdAndDelete(userId); 
    
    res.status(200).send({
      success: true,
      message: "User account has been restricted and removed.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error blocking user",
      error,
    });
  }
};const updateDoctorProfileController = async (req, res) => {
  try {
    const { doctorId, ...updateData } = req.body;
    
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).send({
      success: true,
      message: "Doctor Profile Updated Successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating doctor profile",
      error,
    });
  }
};
const getAdminStatsController = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments({ isAdmin: false });
    const totalDoctors = await doctorModel.countDocuments({ status: "approved" });
    
    const allAppointments = await appointmentModel.find({});
    const todayAppointments = allAppointments.filter(app => {
      // The date is stored as an ISO string of the date (DD-MM-YYYY converted to ISO)
      return moment(app.date).isSame(moment(), 'day');
    });

    res.status(200).send({
      success: true,
      message: "Admin stats fetched successfully",
      data: {
        totalUsers,
        totalDoctors,
        todayAppointmentsCount: todayAppointments.length
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching admin stats",
      error
    });
  }
};

module.exports = {
  createDoctorController,
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  toggleAbsentStatusController,
  blockUserController,
  updateDoctorProfileController,
  getAdminStatsController
};