const Transaction = require("../models/transaction");
const User = require("../models/user");

exports.getUserTransactions = async (req, res) => {
  const { userId } = req.params;
  const { status, type, from, to, page = 1, limit = 10 } = req.query;

  const match = { userId };
  if (status) match.status = status;
  if (type) match.type = type;
  if (from || to) {
    match.transactionDate = {};
    if (from) match.transactionDate.$gte = new Date(from);
    if (to) match.transactionDate.$lte = new Date(to);
  }

  try {
    const transactions = await Transaction.aggregate([
      { $match: match },
      { $sort: { transactionDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit, 10) },
    ]);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactionsWithUserDetails = async (req, res) => {
  const { status, type, from, to, page = 1, limit = 10 } = req.query;

  const match = {};
  if (status) match.status = status;
  if (type) match.type = type;
  if (from || to) {
    match.transactionDate = {};
    if (from) match.transactionDate.$gte = new Date(from);
    if (to) match.transactionDate.$lte = new Date(to);
  }

  try {
    const transactions = await Transaction.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { transactionDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit, 10) },
    ]);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
