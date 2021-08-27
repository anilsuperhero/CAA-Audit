var express = require("express");
var router = express.Router();
var controller = require("../controllers/companyDocument.controller");
const VerifyToken = require("../config/VerifyToken");
var validationRule = require("../validationRules/companyDocument");

router.get("/", VerifyToken, controller.Index);
router.post(
  "/",
  VerifyToken,
  validationRule.validate("Create"),
  controller.Create
);
router.delete(
  "/",
  VerifyToken,
  validationRule.validate("Delete"),
  controller.Delete
);
router.post(
  "/update",
  VerifyToken,
  validationRule.validate("Edit"),
  controller.Update
);
router.patch(
  "/",
  VerifyToken,
  validationRule.validate("Delete"),
  controller.Process
);

module.exports = router;
