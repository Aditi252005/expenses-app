const Transaction = require("../models/transaction");
const { validateTransaction } = require("../utils/validators");
const { computeSummary } = require("../services/transactionService");

async function getAll(req, res, next) {
  try {
    const transactions = await Transaction.find({ userId: req.user }).sort({
      date: -1,
      createdAt: -1,
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, amount, type, category, date } = req.body;

    const errors = validateTransaction({ title, amount, type, category, date });
    if (errors.length) {
      return res.status(400).json({ msg: errors[0], errors });
    }

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date,
      userId: req.user,
    });

    const summary = await computeSummary(req.user);

    res.status(201).json({ transaction, ...summary });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Not found" });
    }

    if (transaction.userId.toString() !== req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await transaction.deleteOne();

    const summary = await computeSummary(req.user);

    res.json({ msg: "Deleted successfully", ...summary });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, remove };
