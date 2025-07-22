const asyncHandler = require('express-async-handler');
const ContentHistory = require('../models/ContentHistory');

const getUserContentHistory = asyncHandler(async (req, res) => {
    const history = await ContentHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(history);
});

module.exports = { getUserContentHistory };
