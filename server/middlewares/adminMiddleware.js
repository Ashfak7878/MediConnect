const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {    const user = await userModel.findById(req.body.userId);    if (user.isAdmin !== true) {
      return res.status(200).send({
        success: false,
        message: "Access Denied: Only Admin Access Allowed",
      });
    } else {      next();
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