const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

// ==========================================
// 1. GET ALL USERS
// ==========================================
const getAllUsersController = async (req, res) => {
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
};

// ==========================================
// 2. GET ALL DOCTORS (For Admin Panel)
// ==========================================
const getAllDoctorsController = async (req, res) => {
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
};

// ==========================================
// 3. CHANGE DOCTOR ACCOUNT STATUS (Approve/Reject)
// ==========================================
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    
    // Update the doctor's status
    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId, 
      { status }, 
      { new: true }
    );

    // Find the user who applied to be a doctor to send them a notification
    const user = await userModel.findOne({ _id: doctor.userId });
    
    if (user) {
      const notification = user.notification || [];
      notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request has been ${status}`,
        onClickPath: "/notification",
      });
      
      // If approved, give them doctor privileges
      user.isDoctor = status === "approved" ? true : false;
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
};

// ==========================================
// 4. TOGGLE DOCTOR ABSENT STATUS
// ==========================================
const toggleAbsentStatusController = async (req, res) => {
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
};

// ==========================================
// 5. BLOCK USER ACCOUNT
// ==========================================
const blockUserController = async (req, res) => {
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
};

// Export all 5 functions together!
module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  toggleAbsentStatusController,
  blockUserController 
};