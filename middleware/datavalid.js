const express_validator = require("express-validator");
function data_validator() {
  console.log("error comes from validator");
  return [
    express_validator.body("username").trim().isLength({ min: 4 }),
    express_validator.body("password").trim().isLength({ min: 6 }),
  ];
}
function handleValidationErrors(req, res, next) {
  const errors = express_validator.validationResult(req);
  if (!errors.isEmpty()) {
    res.send("Validation error: " + errors);
  }
  next();
}
module.exports = { data_validator, handleValidationErrors };
