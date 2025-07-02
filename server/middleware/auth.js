const jwt = require("jsonwebtoken");

const auth = (requiredRole) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        // Check if the Authorization header exists
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Check role if required
            if (requiredRole && req.user.role !== requiredRole) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = auth;