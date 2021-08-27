var express = require("express");
var router = express.Router();
const document = require("../controllers/document.controller");
const VerifyToken = require("../config/VerifyToken");
var documentValidationRule = require("../validationRules/document");

router.get("/updateStaff", VerifyToken, document.updateStaff);
router.post(
  "/primary",
  VerifyToken,
  documentValidationRule.validate("primaryDocument"),
  document.updatePrimaryDocument
);
router.post(
  "/secondary",
  VerifyToken,
  documentValidationRule.validate("primaryDocument"),
  document.updateSecondaryDocument
);
router.post("/updateDocument", VerifyToken, document.updateDocument);
router.post("/getPrimaryDocument", VerifyToken, document.getPrimaryDocument);
router.post(
  "/getSecondaryDocument",
  VerifyToken,
  document.getSecondaryDocument
);
router.post("/deleteDocument", VerifyToken, document.deleteDocument);
router.post(
  "/updateDocumentStatus",
  VerifyToken,
  document.updateDocumentStatus
);
router.post("/singleDocument", VerifyToken, document.singleDocument);
router.post("/multiDocument", VerifyToken, document.multiDocument);
router.post("/submitRequest", VerifyToken, document.submitRequest);
router.post("/downloadDocument", VerifyToken, document.downloadDocument);
router.post(
  "/downloadSecondaryDocument",
  VerifyToken,
  document.downloadSecondaryDocument
);
router.post("/downloadZip", VerifyToken, document.downloadZip);
router.get("/rejectionReasons", VerifyToken, document.rejectionReasons);
module.exports = router;
