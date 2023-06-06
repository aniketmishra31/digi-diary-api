const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    let token = req.headers["authorization"];
    try {
        if (!token) {
            return res.status(403).json({ error: "You are not authorized" });
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = isAuthenticated;