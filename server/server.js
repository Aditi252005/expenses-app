require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/dist/index.html"));
// });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/expense", require("./routes/expense"));

app.listen(5000, () => console.log("Server running on 5000"));