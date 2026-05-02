const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTPEmail = async (email, otp) => {
  try {
    let transporter;
    
    // Check if real email credentials are provided in .env
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Fallback to fake test account (development only)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: '"Medi-Connect" <noreply@mediconnect.com>',
      to: email,
      subject: "Your OTP for Medi-Connect",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4A90E2; text-align: center;">Medi-Connect</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for registration is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #777; text-align: center;">This OTP is valid for 5 minutes. Do not share this with anyone.</p>
        </div>
      `,
    });

    return { success: true, isEthereal: !(process.env.EMAIL_USER && process.env.EMAIL_PASS), info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Resend OTP for unverified user
        const otp = generateOTP();
        existingUser.otp = otp;
        existingUser.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
        
        const emailResult = await sendOTPEmail(existingUser.email, otp);
        if (!emailResult.success) {
          return res.status(500).send({ message: "Failed to send OTP email. Please try again later.", success: false });
        }

        await existingUser.save();
        
        // Only log in development
        if (process.env.NODE_MODE === 'development') {
           console.log(`[DEV ONLY] OTP for ${existingUser.email} is: ${otp}`);
        }

        return res.status(200).send({ message: "Unverified account. A new OTP has been sent to your email", success: true, requireOtp: true });
      }
      return res.status(200).send({ message: "User Already Exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    req.body.isVerified = false; // By default

    const newUser = new userModel(req.body);
    const otp = generateOTP();
    newUser.otp = otp;
    newUser.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const emailResult = await sendOTPEmail(newUser.email, otp);
    if (!emailResult.success) {
       return res.status(500).send({ message: "Failed to send OTP email. Make sure a valid email is provided.", success: false });
    }

    await newUser.save();
    
    if (process.env.NODE_MODE === 'development') {
      console.log(`[DEV ONLY] OTP for ${newUser.email} is: ${otp}`);
    }

    res.status(201).send({ message: "Registered Successfully. Please check your email inbox (or spam folder) for the OTP.", success: true, requireOtp: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register failed: ${error.message}` });
  }
};const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid Email or Password", success: false });
    }
    
    if (!user.isVerified) {
      // Auto resend OTP if they try to log in without veryfying
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
      
      const emailResult = await sendOTPEmail(user.email, otp);
      if (!emailResult.success) {
        return res.status(500).send({ message: "Failed to send verification email.", success: false });
      }

      await user.save();
      if (process.env.NODE_MODE === 'development') {
         console.log(`[DEV ONLY] Resent OTP for ${user.email} is: ${otp}`);
      }
      return res.status(200).send({ message: "Please verify your account first. A new OTP has been sent.", success: false, unverified: true });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    if (user.otp !== otp) {
      return res.status(200).send({ message: "Invalid OTP", success: false });
    }

    if (new Date() > user.otpExpiration) {
      return res.status(200).send({ message: "OTP has expired", success: false });
    }

    // OTP verified, clear it out and verify user
    user.otp = null;
    user.otpExpiration = null;
    user.isVerified = true;
    await user.save();

    res.status(200).send({ message: "Registration successful! You can now log in.", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Verify OTP CTRL ${error.message}` });
  }
};

const verify2FAController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(200).send({ message: "User not found", success: false });
    if (user.otp !== otp) return res.status(200).send({ message: "Invalid OTP", success: false });
    if (new Date() > user.otpExpiration) return res.status(200).send({ message: "OTP has expired", success: false });

    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error verifying 2FA: ${error.message}`, success: false });
  }
};

const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(200).send({ message: "User not found", success: false });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    
    const emailResult = await sendOTPEmail(user.email, otp);
    if (!emailResult.success) {
      return res.status(500).send({ message: "Failed to send OTP email.", success: false });
    }

    await user.save();
    if (process.env.NODE_MODE === 'development') {
       console.log(`[DEV ONLY] Resent OTP for ${user.email} is: ${otp}`);
    }
    
    res.status(200).send({ message: "OTP has been resent to your email.", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error resending OTP: ${error.message}`, success: false });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(200).send({ message: "No account found with that email", success: false });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    
    const emailResult = await sendOTPEmail(user.email, otp);
    if (!emailResult.success) {
      return res.status(500).send({ message: "Failed to send OTP email.", success: false });
    }

    await user.save();
    res.status(200).send({ message: "OTP sent to your email.", success: true });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error.message}`, success: false });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(200).send({ message: "User not found", success: false });
    if (user.otp !== otp) return res.status(200).send({ message: "Invalid OTP", success: false });
    if (new Date() > user.otpExpiration) return res.status(200).send({ message: "OTP has expired", success: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    res.status(200).send({ message: "Password reset successful! You can now log in.", success: true });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error.message}`, success: false });
  }
};const authController = async (req, res) => {
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
};const getAllNotificationController = async (req, res) => {
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
};const deleteAllNotificationController = async (req, res) => {
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
};const getAllApprovedDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({ success: true, message: "Doctors Fetched Successfully", data: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error, message: "Error While Fetching Doctors" });
  }
};const bookAppointmentController = async (req, res) => {
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
};const bookingAvailabilityController = async (req, res) => {
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
};const userAppointmentsController = async (req, res) => {
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
};const updateProfileController = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await userModel.findById(req.body.userId);
    
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    user.name = name || user.name;
    await user.save();
    
    // Do not return password string for security
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating profile",
      error
    });
  }
};

module.exports = {
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
  updateProfileController,
};