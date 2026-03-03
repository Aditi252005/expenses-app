const router = require("express").Router();
const Expense = require("../models/expense");
const User = require("../models/user");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// Get All Expenses
router.get("/", auth, async (req, res) => {
  const expenses = await Expense.find({
    userId: req.user.id,
  }).sort({ date: -1 });

  res.json(expenses);
});

// Add Expense
router.post("/", auth, async (req, res) => {
  const { title, amount, type, date } = req.body;
  
  const today = new Date();
    const selectedDate = new Date(date);

    if (selectedDate > today) {
      return res.status(400).json({
        msg: "Cannot add future date transaction"
      });
    }
  const user = await User.findById(req.user.id);

  const previousBalance = user.balance;
  const currentBalance =
    type === "expense"
      ? previousBalance - amount
      : previousBalance + amount;

  const expense = await Expense.create({
    title,
    amount,
    type,
    date,
    previousBalance,
    currentBalance,
    userId: user._id
  });

  user.balance = currentBalance;
  await user.save();

  res.json({ expense, previousBalance, currentBalance });
});


// Date Range Summary
router.get("/summary", auth, async (req, res) => {
  const { start, end } = req.query;

  try {
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          type: "expense",
          date: {
            $gte: new Date(start),
            $lte: new Date(end)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      totalSpent: result[0]?.totalSpent || 0
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE Expense
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Not found" });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Recalculate balance
    const user = await User.findById(req.user.id);

    if (expense.type === "expense") {
      user.balance += expense.amount;
    } else {
      user.balance -= expense.amount;
    }

    await user.save();
    await expense.deleteOne();

    res.json({ msg: "Deleted successfully", balance: user.balance });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE Expense
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, amount, type, date } = req.body;

    const expense = await Expense.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!expense) {
      return res.status(404).json({ msg: "Not found" });
    }

    // Step 1: Reverse old transaction
    if (expense.type === "expense") {
      user.balance += expense.amount;
    } else {
      user.balance -= expense.amount;
    }

    // Step 2: Apply new transaction
    if (type === "expense") {
      user.balance -= amount;
    } else {
      user.balance += amount;
    }

    await user.save();

    // Update expense
    expense.title = title;
    expense.amount = amount;
    expense.type = type;
    expense.date = date;

    await expense.save();

    res.json({ msg: "Updated", balance: user.balance });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/export", auth, async (req, res) => {
  const { start, end } = req.query;

  const expenses = await Expense.find({
    userId: req.user.id,
    date: {
      $gte: new Date(start),
      $lte: new Date(end)
    }
  });

  const { Parser } = require("json2csv");
  const parser = new Parser();
  const csv = parser.parse(expenses);

  res.header("Content-Type", "text/csv");
  res.attachment("expenses.csv");
  res.send(csv);
});

module.exports = router;