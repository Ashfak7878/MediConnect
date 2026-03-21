const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    // 1. Find the user making the request (their ID was decoded by the authMiddleware just before this)
    const user = await userModel.findById(req.body.userId);
    
    // 2. Check their role
    if (user.isAdmin !== true) {
      return res.status(200).send({
        success: false,
        message: "Access Denied: Only Admin Access Allowed",
      });
    } else {
      // 3. If they are an Admin, let them pass through to the controller
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Authorization Failed in Admin Security Gateway",
      error,
    });
  }
};