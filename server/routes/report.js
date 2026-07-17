const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getSummary,
  getRange,
  getMonthly,
  getYearly,
  getCategoryBreakdown,
} = require("../controllers/reportController");

router.get("/summary", auth, getSummary);
router.get("/range", auth, getRange);
router.get("/monthly", auth, getMonthly);
router.get("/yearly", auth, getYearly);
router.get("/categories", auth, getCategoryBreakdown);

module.exports = router;
