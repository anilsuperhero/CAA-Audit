var express = require("express");
var router = express.Router();
var service = require("../services/crons/crons.services");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//
/*
REMINDER_FOR_SLA_SIGNING;

REMINDER_FOR_PAYMENT_OF_DEPOSIT;

REMINDER_FOR_INITIAL_DOCUMENT_UPLOAD;

REMINDER_FOR_ADDITIONAL_DOCUMENT_UPLOAD;

REMINDER_FOR_PAYMENT_OF_DEPOSIT_2;

REMINDER_FOR_PEER_AUDITOR_APPROVAL_ON_REPORT;

REMINDER_FOR_CLIENT_APPROVAL_ON_REPORT;

REMINDER_FOR_AUDIT_SUBMISSION_TO_ADMIT;
*/
//

router.get("/cron/REMINDER_FOR_SLA_SIGNING", async function (req, res, next) {
  try {
    await service.REMINDER_FOR_SLA_SIGNING(req, res);
  } catch (err) {
    var msg = err.message || "SOMETHING_WENT_WRONG!";
    return res.json(responseData(msg, {}, 201));
  }
});

router.get(
  "/cron/REMINDER_FOR_INITIAL_DOCUMENT_UPLOAD",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_INITIAL_DOCUMENT_UPLOAD(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get(
  "/cron/REMINDER_FOR_ADDITIONAL_DOCUMENT_UPLOAD",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_ADDITIONAL_DOCUMENT_UPLOAD(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get(
  "/cron/REMINDER_FOR_PAYMENT_OF_DEPOSIT_2",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_PAYMENT_OF_DEPOSIT_2(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get(
  "/cron/REMINDER_FOR_PEER_AUDITOR_APPROVAL_ON_REPORT",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_PEER_AUDITOR_APPROVAL_ON_REPORT(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get(
  "/cron/REMINDER_FOR_CLIENT_APPROVAL_ON_REPORT",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_CLIENT_APPROVAL_ON_REPORT(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get(
  "/cron/REMINDER_FOR_AUDIT_SUBMISSION_TO_ADMIT",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_AUDIT_SUBMISSION_TO_ADMIT(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get(
  "/cron/REMINDER_FOR_SLA_SIGNING_TO_COMPANY",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_SLA_SIGNING_TO_COMPANY(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get(
  "/cron/REMINDER_FOR_PAYMENT_OF_DEPOSIT",
  async function (req, res, next) {
    try {
      await service.REMINDER_FOR_PAYMENT_OF_DEPOSIT(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  }
);

router.get("/cron/AUDIT_DELETE", async function (req, res, next) {
  try {
    await service.AUDIT_DELETE(req, res);
  } catch (err) {
    var msg = err.message || "SOMETHING_WENT_WRONG!";
    return res.json(responseData(msg, {}, 201));
  }
});

module.exports = router;
