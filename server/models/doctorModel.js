const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // Links this doctor profile to their specific User account
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    // Used for the Patient's Dropdown Menu
    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    feesPerConsultation: {
      type: Number,
      required: [true, "fee is required"],
    },
    timings: {
      type: Object,
      required: [true, "work timing is required"],
    },
    // NEW FEATURE: Admin can switch this to true to hide the doctor from patients
    isAbsent: {
      type: Boolean,
      default: false, 
    },
    // 'pending' (waiting for admin), 'approved' (live on site), or 'rejected'
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;