import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pincode:{type:String},
  city:{type:String},
});

const rtouser1 = mongoose.models.rtouser || mongoose.model("rtouser", userSchema);

export default rtouser1;
