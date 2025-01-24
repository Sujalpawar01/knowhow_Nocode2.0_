import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position:{type:String},
  aadharCardNo:{type:String},
  defenceIdNo:{type:String},
  idCard:{type:String},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
