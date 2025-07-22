const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const { getUserContentHistory } = require("../controllers/contentHistoryController");

router.get('/history', isAuthenticated, getUserContentHistory);

module.exports = router;
