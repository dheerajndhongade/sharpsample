const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

module.exports = app;
