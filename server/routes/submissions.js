const express = require("express");
const Submission = require("../models/Submission");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth("user"), async (req, res) => {
    const submission = new Submission({
        formId: req.body.formId,
        userId: req.user.id,
        responses: req.body.responses
    });
    await submission.save();
    res.status(201).json(submission);
});

router.get("/form/:formId", auth("admin"), async (req, res) => {
    try {
        const submissions = await Submission.find({ formId: req.params.formId }).populate("userId", "name email");
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch submissions." });
    }
});

router.get("/user/:userId", auth("admin"), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("name email");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user details" });
    }
});

module.exports = router;