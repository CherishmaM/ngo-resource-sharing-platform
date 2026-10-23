const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("🔴 No token provided");
        return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware
    } catch (error) {
        console.log("❌ Token verification failed:", error.message);
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
