const { body, check } = require("express-validator");
const { validatorMiddleware } = require("../helpers/helpers");

module.exports.validate = (method) => {
  switch (method) {
    case "primaryDocument": {
      return [
        body("audit_id", "Please enter audit id.").isLength({ min: 1 }),
        body("status", "Please enter status.").isLength({ min: 1 }),
        body("type", "Please enter type.").isLength({ min: 1 }),
        body("staff_id", "Please enter staff.").isLength({ min: 1 }),
        validatorMiddleware,
      ];
    }
  }
};
