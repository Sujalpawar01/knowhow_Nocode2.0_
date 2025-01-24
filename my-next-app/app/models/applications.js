import mongoose from "mongoose";

// Define the schema for the appointment
const ApplicationSchema = new mongoose.Schema({
  service: { type: String, required: true },
  doneDate: { type: Date, required: true },  // Ensure this is named `doneDate`
  status: { type: String, required: true },
  registerid: { type: String, required: true },
  city: { type: String, required: true },
});

// Export the model. Name the model correctly (BookAppointment)
const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

export default Application;