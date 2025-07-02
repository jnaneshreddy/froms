const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    responses: mongoose.Schema.Types.Mixed,
    submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", SubmissionSchema);