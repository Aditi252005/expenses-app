const mongoose = require("mongoose");
const { ALL_CATEGORIES } = require("../utils/categories");

// NOTE: previousBalance/currentBalance snapshots were removed on purpose.
// Those snapshots went stale the moment an earlier transaction was edited or
// deleted, which was the other half of the balance-drift bug. Balance,
// income/expense totals, and category breakdowns are all computed live via
// aggregation (see reportController.js), so there is exactly one source of
// truth: the transactions themselves.
const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, enum: ALL_CATEGORIES, required: true },
    date: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
