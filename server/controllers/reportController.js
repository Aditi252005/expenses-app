const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const { computeSummary } = require("../services/transactionService");

async function getSummary(req, res, next) {
  try {
    const summary = await computeSummary(req.user);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

// Preserves the original date-range "total spent" feature, generalized to
// optionally report income too.
async function getRange(req, res, next) {
  try {
    const { start, end, type = "expense" } = req.query;

    if (!start || !end) {
      return res.status(400).json({ msg: "start and end dates are required" });
    }

    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          type,
          date: { $gte: new Date(start), $lte: endOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({ totalSpent: result[0]?.total || 0 });
  } catch (err) {
    next(err);
  }
}

async function getMonthly(req, res, next) {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          date: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }));

    result.forEach((r) => {
      months[r._id.month - 1][r._id.type] = r.total;
    });

    res.json({ year, months });
  } catch (err) {
    next(err);
  }
}

async function getYearly(req, res, next) {
  try {
    const result = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
      {
        $group: {
          _id: { year: { $year: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1 } },
    ]);

    const byYear = {};
    result.forEach((r) => {
      const y = r._id.year;
      if (!byYear[y]) byYear[y] = { year: y, income: 0, expense: 0 };
      byYear[y][r._id.type] = r.total;
    });

    res.json({ years: Object.values(byYear) });
  } catch (err) {
    next(err);
  }
}

async function getCategoryBreakdown(req, res, next) {
  try {
    const { start, end, type = "expense" } = req.query;

    const match = { userId: new mongoose.Types.ObjectId(req.user), type };

    if (start && end) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      match.date = { $gte: new Date(start), $lte: endOfDay };
    }

    const result = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    res.json(result.map((r) => ({ category: r._id, total: r.total })));
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary, getRange, getMonthly, getYearly, getCategoryBreakdown };
