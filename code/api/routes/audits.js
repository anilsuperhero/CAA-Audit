var express = require("express");
var router = express.Router();
var controller = require("../controllers/audits.controller");
const VerifyToken = require("../config/VerifyToken");
var validationRule = require("../validationRules/audits");

router.get("/", VerifyToken, controller.Index);
router.post(
  "/",
  VerifyToken,
  validationRule.validate("Create"),
  controller.Create
);
router.post(
  "/assign",
  VerifyToken,
  validationRule.validate("Assign"),
  controller.Assign
);
router.delete("/", VerifyToken, controller.Delete);
router.get("/admin", VerifyToken, controller.indexAdmin);
router.get("/auditor", VerifyToken, controller.indexAuditor);
router.post(
  "/slaUpload",
  VerifyToken,
  validationRule.validate("slaUpload"),
  controller.slaUpload
);
router.post("/signature", VerifyToken, controller.slaSignature);
router.get("/docuSign", VerifyToken, controller.docuSign);
router.get("/documentList", VerifyToken, controller.documentList);
router.post("/updateRequest", VerifyToken, controller.updateRequest);
router.post("/uploadReport", VerifyToken, controller.uploadReport);
router.post("/uploadReportNew", VerifyToken, controller.uploadReportNew);
router.post("/rejectReport", VerifyToken, controller.rejectReport);
router.post("/rejectReportStage", VerifyToken, controller.rejectReportStage);
router.post("/acceptReport", VerifyToken, controller.acceptReport);
router.get("/documentRequest", VerifyToken, controller.documentRequest);
router.get(
  "/documentRequestCompany",
  VerifyToken,
  controller.documentRequestCompany
);
module.exports = router;
