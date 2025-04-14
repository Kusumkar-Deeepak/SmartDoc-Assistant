import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalname: { type: String, required: true },
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  protected: { type: Boolean, default: false },
  password: { type: String }, 
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// Add methods to the schema
DocumentSchema.methods = {
  // Method to compare passwords
  comparePassword: async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },
};

// Pre-save hook to hash password before saving
DocumentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Document", DocumentSchema);
