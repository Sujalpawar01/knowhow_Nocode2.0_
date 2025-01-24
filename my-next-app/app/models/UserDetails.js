import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User collection
      required: true,
    },
    position: {
      type: String,
      enum: ["Military Personnel", "Jawan", "Veteran"],
      required: true,
    },
    aadharCardNo: {
      type: String,
      required: true,
      unique: true,
    },
    defenceIdNo: {
      type: String,
      required: true,
    },
    idCard: {
      type: String, // File path to the uploaded ID card
      required: true,
    },
    approved:{type:Boolean},
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const UserDetails =
  mongoose.models.UserDetails || mongoose.model("UserDetails", userDetailsSchema);

export default UserDetails;
