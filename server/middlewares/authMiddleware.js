const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Auth Failed: No Token Provided", success: false });
    }    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Auth Failed: Invalid Token", success: false });
      } else {        if (!req.body) req.body = {};
        
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log("Middleware Error:", error.message);
    res.status(401).send({ message: "Auth Failed", success: false });
  }
};