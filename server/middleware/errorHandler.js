function notFound(req, res, next) {
  res.status(404).json({ msg: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ msg: Object.values(err.errors)[0]?.message || "Validation error" });
  }

  if (err.code === 11000) {
    return res.status(400).json({ msg: "Account already exists. Please login." });
  }

  res.status(err.status || 500).json({ msg: err.message || "Server error" });
}

module.exports = { notFound, errorHandler };
