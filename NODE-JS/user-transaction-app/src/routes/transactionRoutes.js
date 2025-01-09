const express = require("express");
const {
  getUserTransactions,
  getTransactionsWithUserDetails,
} = require("../controllers/transactionController");
const router = express.Router();

router.get("/user/:userId", getUserTransactions);
router.get("/", getTransactionsWithUserDetails);

module.exports = router;
