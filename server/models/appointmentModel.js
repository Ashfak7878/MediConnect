const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // The ID of the Patient making the booking
    userId: {
      type: String,
      required: true,
    },
    // The ID of the Doctor being booked
    doctorId: {
      type: String,
      required: true,
    },
    // A snapshot of the Doctor's details (Name, Fees, Phone)
    doctorInfo: {
      type: Object,
      required: true,
    },
    // A snapshot of the Patient's details (Name, Phone)
    userInfo: {
      type: Object,
      required: true,
    },
    // The specific day of the appointment
    date: {
      type: String,
      required: true,
    },
    // The specific time block the patient chose
    time: {
      type: String,
      required: true,
    },
    // 'pending' (waiting for doctor approval), 'approved', or 'rejected'
    status: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);
module.exports = appointmentModel;