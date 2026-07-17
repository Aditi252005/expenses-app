const { ALL_CATEGORIES } = require("./categories");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup({ name, email, password }) {
  const errors = [];

  if (!name || !name.trim()) errors.push("Name is required.");
  if (!email || !EMAIL_REGEX.test(email)) errors.push("A valid email is required.");
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return errors;
}

function validateLogin({ email, password }) {
  const errors = [];
  if (!email) errors.push("Email is required.");
  if (!password) errors.push("Password is required.");
  return errors;
}

function validateTransaction({ title, amount, type, category, date }) {
  const errors = [];

  if (!title || !title.trim()) errors.push("Title is required.");

  const amountNum = Number(amount);
  if (amount === undefined || amount === null || amount === "" || isNaN(amountNum)) {
    errors.push("Amount must be a number.");
  } else if (amountNum <= 0) {
    errors.push("Amount must be greater than zero.");
  }

  if (!["income", "expense"].includes(type)) {
    errors.push("Type must be either 'income' or 'expense'.");
  }

  if (!category || !ALL_CATEGORIES.includes(category)) {
    errors.push("A valid category is required.");
  }

  if (!date) {
    errors.push("Date is required.");
  } else {
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      errors.push("Date is invalid.");
    } else {
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      if (selectedDate > endOfToday) {
        errors.push("Cannot add a future-dated transaction.");
      }
    }
  }

  return errors;
}

module.exports = { validateSignup, validateLogin, validateTransaction };
