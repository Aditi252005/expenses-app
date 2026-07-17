// Single source of truth for allowed categories, shared conceptually with the
// frontend's CATEGORIES list (client/src/utils/categories.js). Keep both in sync.

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Other",
];

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Gift", "Other"];

const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

module.exports = { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES };
