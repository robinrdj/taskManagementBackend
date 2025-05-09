const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

//for checking
app.get("/", (req, res) => {
  res.send("backend is running");
});
app.get("/check", (req, res) => {
  res.send("checking");
});
app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", require("./routes/tasks"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
