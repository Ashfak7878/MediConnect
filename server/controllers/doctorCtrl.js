const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: 'Doctor data fetched successfully',
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error fetching doctor info',
    });
  }
};const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true } // Ensures it returns the newly updated document
    );
    res.status(200).send({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: 'A doctor with this email or phone number already exists.',
      });
    }
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error updating doctor profile',
    });
  }
};const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    
    if (!doctor) {
      return res.status(200).send({
        success: false,
        message: 'No doctor profile found for this user',
        data: [],
      });
    }    const appointments = await appointmentModel.find({ doctorId: doctor._id.toString() });
    
    res.status(200).send({
      success: true,
      message: 'Doctor Appointments Fetched Successfully',
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error in fetching Doctor Appointments',
    });
  }
};const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId, 
      { status },
      { new: true } 
    );

    const user = await userModel.findOne({ _id: appointments.userId });
    
    if (!user.notification) {
      user.notification = [];
    }

    user.notification.push({
      type: 'status-updated',
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: '/doctor-appointments'
    });
    
    await user.save();

    res.status(200).send({
      success: true,
      message: 'Appointment Status Updated Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error In Update Status',
    });
  }
};const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching single doctor info",
    });
  }
};module.exports = { 
  getDoctorInfoController, 
  updateProfileController, 
  doctorAppointmentsController, 
  updateStatusController,
  getDoctorByIdController // <-- Added here so the router can use it!
};