const mongoose = require("mongoose");

// NOTE: intentionally no `balance` field here. Storing balance as a mutable
// counter on the user was the root cause of the balance-drift bugs in the
// previous version (it could get out of sync with the actual transactions).
// Balance is now always derived from the Transaction collection - see
// controllers/reportController.js. This makes it impossible for the balance
// to disagree with the ledger.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
