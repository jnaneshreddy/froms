const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
    id: String,
    label: String,
    type: String,
    placeholder: String,
    options: [String],
});

const FormSchema = new mongoose.Schema({
    title: String,
    description: String,
    fields: [FieldSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Form", FormSchema);