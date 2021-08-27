const Audits = require("../../models/Audits");
const AuditLog = require("../../models/AuditLog");
const { responseData } = require("../../helpers/responseData");
const Users = require("../../models/User");
const { sendNotification } = require("../../helpers/helpers");

module.exports = {
  submitRequest: async (req, res) => {
    try {
      const { auditDate, description, auditId } = req.body;
      Audits.findOne({ _id: auditId }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          var request = {};
          request.audit_date_stage = auditDate;
          request.description_stage = description;
          request.status = "REQUEST_STAGE";
          request.status_view = "REQUEST_STAGE";
          request.is_stage = true;

          const reminderInfo = {};
          reminderInfo.lastReminderDate = "";
          reminderInfo.nextReminderDate = "";
          reminderInfo.reminderCount = 0;
          request.reminderInfo = reminderInfo;

          await Audits.updateOne({ _id: auditId }, request);

          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = result._id;
          auditLog.audit_number = result.audit_number;
          auditLog.company_id = result.company_id;
          auditLog.type = result.type.toUpperCase();
          auditLog.status = "REQUEST_STAGE";
          auditLog.save();

          /**
           * Send notification to admin
           */
          var company = await Users.findOne({ _id: result.company_id });
          var users = await Users.findOne({ role_id: 1 });
          var message = `${company.company_name} requested for 2 stage audit for quote reference number #${result.title}`;
          var notification = {};
          notification.user = users;
          notification.message = message;
          notification.action =
            "audit-request?type=viewDetails&audit_id=" + result._id;
          notification.title = "Audit Request";
          notification.isMail = true;
          sendNotification(notification);
          return res.json(responseData("AUDIT_UPLOAD"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
};
