const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // 1. Check if the header even exists to prevent "split of undefined" errors
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Auth Failed: No Token Provided", success: false });
    }

    // 2. Safely extract the token
    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Auth Failed: Invalid Token", success: false });
      } else {
        // Ensure req.body exists (Your fix!)
        if (!req.body) req.body = {};
        
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log("Middleware Error:", error.message);
    res.status(401).send({ message: "Auth Failed", success: false });
  }
};