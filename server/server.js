const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/forms");
const submissionRoutes = require("./routes/submissions");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',  // Replace with your actual Vercel URL
    /\.vercel\.app$/,  // Allow any Vercel subdomain
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/submissions", submissionRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});