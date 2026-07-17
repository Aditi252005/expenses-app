const mongoose = require("mongoose");
const Transaction = require("../models/transaction");

// The single source of truth for balance math. Every place in the app that
// needs a balance, income total, or expense total calls this - there is no
// second copy of these numbers stored anywhere, so they cannot drift apart.
async function computeSummary(userId) {
  const result = await Transaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totals = { income: 0, expense: 0 };
  result.forEach((r) => {
    totals[r._id] = r.total;
  });

  return {
    balance: totals.income - totals.expense,
    totalIncome: totals.income,
    totalExpense: totals.expense,
  };
}

module.exports = { computeSummary };
