import mongoose from "mongoose";

// Define the schema for the appointment
const appointmentSchema = new mongoose.Schema({
  option: { type: String, required: true },
  date: { type: Date, required: true },
  city: { type: String, required: true },
  registerid: { type: String, required: true },
  approved: { type: Boolean, default: false },
  done: { type: Boolean, default: false },
  role:{type:String},
  name:{type:String},
});

// Export the model. Name the model correctly (BookAppointment)
const BookAppointment = mongoose.models.BookAppointment || mongoose.model("BookAppointment", appointmentSchema);

export default BookAppointment;