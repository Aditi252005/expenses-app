const router = require("express").Router();
const Expense = require("../models/expense");
const User = require("../models/user");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// Get All Expenses

router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user,
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add Expense
router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, type, date } = req.body;
    const amountNum=Number(amount);
    const today = new Date();
    const selectedDate = new Date(date);

    if (selectedDate > today) {
      return res.status(400).json({
        msg: "Cannot add future date transaction",
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const previousBalance = user.balance;

    const currentBalance =
      type === "expense"
        ? previousBalance - amountNum
        : previousBalance + amountNum;

    const expense = await Expense.create({
      title,
      amountNum,
      type,
      date,
      previousBalance,
      currentBalance,
      userId: user._id,
    });

    user.balance = currentBalance;
    await user.save();

    res.json({ expense, previousBalance, currentBalance });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// Date Range Summary
router.get("/summary", auth, async (req, res) => {
  const { start, end } = req.query;

  try {
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
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

    if (expense.userId.toString() !== req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Recalculate balance
    const user = await User.findById(req.user);

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


module.exports = router;