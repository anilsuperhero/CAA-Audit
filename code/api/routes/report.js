var express = require("express");
var router = express.Router();
const report = require("../controllers/report.controller");
const VerifyToken = require("../config/VerifyToken");

router.post("/submitRequest", VerifyToken, report.submitRequest);

module.exports = router;
