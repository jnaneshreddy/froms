const express = require("express");
const Form = require("../models/Form");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth(), async (req, res) => {
    const forms = await Form.find();
    res.json(forms);
});

router.get("/:id", auth(), async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);

        // Check if the form exists
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        res.json(form);
    } catch (error) {
        // Handle invalid ID format or other errors
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/", auth("admin"), async (req, res) => {
    try {
        console.log('Creating form with user:', req.user);
        console.log('Form data:', req.body);
        
        const form = new Form({ 
            ...req.body, 
            createdBy: req.user.id 
        });
        
        const savedForm = await form.save();
        console.log('Form saved successfully:', savedForm);
        
        res.status(201).json(savedForm);
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ 
            message: "Error creating form", 
            error: error.message 
        });
    }
});

router.delete("/:id", auth("admin"), async (req, res) => {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

router.put('/:id', auth('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Find and update the form
        const updatedForm = await Form.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.json(updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ message: 'Error updating form', error: error.message });
    }
});

module.exports = router;