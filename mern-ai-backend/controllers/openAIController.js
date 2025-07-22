const asyncHandler = require('express-async-handler');
const axios = require('axios');
const ContentHistory = require('../models/ContentHistory');
const User = require('../models/User');

const openAIController = asyncHandler(async (req, res) => {
    console.log("Authenticated user:", req.user);

    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1200,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:8090',
                    'X-Title': 'MERN-AI App',
                },
            }
        );

        const content = response?.data?.choices?.[0]?.message?.content?.trim();
        if (!content) {
            return res.status(500).json({ message: 'AI did not return content' });
        }

        const newContent = await ContentHistory.create({
            user: req.user._id,
            content,
        });

        // Defensive fix
        const userFound = await User.findById(req.user._id);
        if (!userFound.contentHistory) userFound.contentHistory = [];
        userFound.contentHistory.push(newContent._id);

        userFound.apiRequestCount += 1;
        await userFound.save();

        res.status(200).json(content);
    } catch (error) {
        console.error("AI generation error:", error.message);
        res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
});

module.exports = { openAIController };
