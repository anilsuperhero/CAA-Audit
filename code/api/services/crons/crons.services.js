const Audits = require("../../models/Audits");
const { responseData } = require("../../helpers/responseData");
const Users = require("../../models/User");
const { response } = require("../../resources/response");
var email_service = require("../email/email.services");
var moment = require("moment");

const { sendNotification, sendMail } = require("../../helpers/helpers");
const _ = require("lodash");

module.exports = {
  REMINDER_FOR_SLA_SIGNING: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "CREATED",
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          var notification = {};
          notification.user = row.company;
          notification.message =
            "Please sign SLA for audit request - " + row.title;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + row._id;
          notification.title = "Reminder - Please SIGN SLA.";
          notification.isMail = true;
          sendNotification(notification);
          var emailOptionsLocal = emailOptions;
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Name]",
            row.company.first_name + " " + row.company.last_name
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Quote_Number]",
            row.title
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.toEmail = row.company.email;
          sendMail(emailOptionsLocal);

          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  REMINDER_FOR_PAYMENT_OF_DEPOSIT: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "SLASIGNED",
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          var notification = {};
          notification.user = row.company;
          notification.message =
            "Please sign SLA for audit request - " + row.title;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + row._id;
          notification.title = "Reminder - Please SIGN SLA.";
          notification.isMail = true;
          sendNotification(notification);
          var emailOptionsLocal = emailOptions;
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Name]",
            row.company.first_name + " " + row.company.last_name
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Quote_Number]",
            row.title
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.toEmail = row.company.email;
          sendMail(emailOptionsLocal);

          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  REMINDER_FOR_INITIAL_DOCUMENT_UPLOAD: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "INVOICE_PAID",
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          var notification = {};
          notification.user = row.company;
          notification.message =
            "Please sign SLA for audit request - " + row.title;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + row._id;
          notification.title = "Reminder - Please SIGN SLA.";
          notification.isMail = true;
          sendNotification(notification);
          var emailOptionsLocal = emailOptions;
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Name]",
            row.company.first_name + " " + row.company.last_name
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Quote_Number]",
            row.title
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.toEmail = row.company.email;
          sendMail(emailOptionsLocal);

          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  REMINDER_FOR_ADDITIONAL_DOCUMENT_UPLOAD: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "PROGRESS",
        required_additional_doc: true,
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          var notification = {};
          notification.user = row.company;
          notification.message =
            "Please sign SLA for audit request - " + row.title;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + row._id;
          notification.title = "Reminder - Please SIGN SLA.";
          notification.isMail = true;
          sendNotification(notification);
          var emailOptionsLocal = emailOptions;
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Name]",
            row.company.first_name + " " + row.company.last_name
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Quote_Number]",
            row.title
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.toEmail = row.company.email;
          sendMail(emailOptionsLocal);

          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  REMINDER_FOR_PAYMENT_OF_DEPOSIT_2: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "REPORT_UPLOAD_STAGE",
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          var notification = {};
          notification.user = row.company;
          notification.message =
            "Please sign SLA for audit request - " + row.title;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + row._id;
          notification.title = "Reminder - Please SIGN SLA.";
          notification.isMail = true;
          sendNotification(notification);
          var emailOptionsLocal = emailOptions;
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Name]",
            row.company.first_name + " " + row.company.last_name
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Quote_Number]",
            row.title
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.toEmail = row.company.email;
          sendMail(emailOptionsLocal);

          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  REMINDER_FOR_PEER_AUDITOR_APPROVAL_ON_REPORT: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "SEND_PEER",
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          var notification = {};
          notification.user = row.company;
          notification.message =
            "Please sign SLA for audit request - " + row.title;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + row._id;
          notification.title = "Reminder - Please SIGN SLA.";
          notification.isMail = true;
          sendNotification(notification);
          var emailOptionsLocal = emailOptions;
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Name]",
            row.company.first_name + " " + row.company.last_name
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Quote_Number]",
            row.title
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.toEmail = row.company.email;
          sendMail(emailOptionsLocal);

          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  REMINDER_FOR_CLIENT_APPROVAL_ON_REPORT: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "SEND_REPORT_COMPANY",
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          var notification = {};
          notification.user = row.company;
          notification.message =
            "Please sign SLA for audit request - " + row.title;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + row._id;
          notification.title = "Reminder - Please SIGN SLA.";
          notification.isMail = true;
          sendNotification(notification);
          var emailOptionsLocal = emailOptions;
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Name]",
            row.company.first_name + " " + row.company.last_name
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[Quote_Number]",
            row.title
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.description = _.replace(
            emailOptionsLocal.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "audit-request?type=viewSla&audit_id=" +
              row._id
          );
          emailOptionsLocal.toEmail = row.company.email;
          sendMail(emailOptionsLocal);

          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  REMINDER_FOR_AUDIT_SUBMISSION_TO_ADMIT: async (req, res) => {
    try {
      let {} = req.query;

      const options = {
        page: 1,
        limit: 20,
      };

      var currentDate = moment().format("DDMMYYYY");
      var nextReminderDate = moment().add(5, "days").format("DDMMYYYY");
      var match = {
        "reminderInfo.nextReminderDate": nextReminderDate,
        status: "ACCEPT_REPORT",
      };
      var match = {};

      var query = Audits.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "company_id",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        {
          $lookup: {
            from: "users",
            localField: "lead",
            foreignField: "_id",
            as: "leadAuditor",
          },
        },
        {
          $unwind: {
            path: "$leadAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "peer",
            foreignField: "_id",
            as: "peerAuditor",
          },
        },
        {
          $unwind: {
            path: "$peerAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "support",
            foreignField: "_id",
            as: "supportAuditor",
          },
        },
        {
          $unwind: {
            path: "$supportAuditor",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: match },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            reminderInfo: { $first: "$reminderInfo" },
            registration_group: { $first: "$registration_group" },
            status: { $first: "$status" },
            status_view: { $first: "$status_view" },
            title: { $first: "$title" },
            audit_number: { $first: "$audit_number" },
            lead: { $first: "$lead" },
            peer: { $first: "$peer" },
            support: { $first: "$support" },
            size_of_company: { $first: "$size_of_company" },
            number_of_clients: { $first: "$number_of_clients" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            sla_document: { $first: "$sla_document" },
            sla_document_old: { $first: "$sla_document_old" },
            amount: { $first: "$amount" },
            advance_payment: { $first: "$advance_payment" },
            final_payment: { $first: "$final_payment" },
            sla_document_name: { $first: "$sla_document_name" },
            invoice_number: { $first: "$invoice_number" },
            invoice_document_name: { $first: "$invoice_document_name" },
            invoice_document: { $first: "$invoice_document" },
            invoice_document_old: { $first: "$invoice_document_old" },
            is_document: { $first: "$is_document" },
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            audit_date_stage: { $first: "$audit_date_stage" },
            description_stage: { $first: "$description_stage" },
            report_stage: { $first: "$report_stage" },
            report_name_stage: { $first: "$report_name_stage" },
            report_remarks_stage: { $first: "$report_remarks_stage" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            startDateStage: { $first: "$startDateStage" },
            endDateStage: { $first: "$endDateStage" },
            is_stage: { $first: "$is_stage" },
            company: {
              $first: {
                name: "$users.company_name",
                first_name: "$users.first_name",
                last_name: "$users.last_name",
                email: "$users.email",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
                _id: "$users._id",
              },
            },
            leadAuditor: {
              $first: {
                last_name: "$leadAuditor.last_name",
                email: "$leadAuditor.email",
                first_name: "$leadAuditor.first_name",
              },
            },
            peerAuditor: {
              $first: {
                last_name: "$peerAuditor.last_name",
                email: "$peerAuditor.email",
                first_name: "$peerAuditor.first_name",
              },
            },
            supportAuditor: {
              $first: {
                last_name: "$supportAuditor.last_name",
                email: "$supportAuditor.email",
                first_name: "$supportAuditor.first_name",
              },
            },
          },
        },
      ]);

      query.sort({ updated_at: -1 });

      var result = await Audits.aggregatePaginate(query, options);
      var data = await response(result);
      if (data.data.length) {
        var emailOptions = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-to-company"
        );

        var emailOptionsAdmin = await email_service.getEmailTemplateBySlug(
          "sign-sla-reminder-action-to-admin"
        );
        const adminDetails = await Users.findOne(
          { role_id: 1 },
          { first_name: 1, last_name: 1, email: 1, _id: 1 }
        );

        var reminderCount = 0;
        data.data.forEach((row) => {
          reminderCount = 1;
          if (row.reminderInfo && row.reminderInfo.reminderCount) {
            reminderCount = row.reminderInfo.reminderCount + 1;
          }

          if (
            row.reminderInfo &&
            row.reminderInfo.reminderCount &&
            row.reminderInfo.reminderCount > 3
          ) {
            // if count get exceed to certain limit send reminder to admin to take action.
            notification = {};
            notification.user = adminDetails;
            notification.message =
              "Company have not signed SLA for Audit Request - " + row.title;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + row._id;
            notification.title = "Reminder - Company have not signed SLA.";
            notification.isMail = true;
            sendNotification(notification);
            var emailOptionsLocal = emailOptionsAdmin;
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Name]",
              adminDetails.first_name + " " + adminDetails.last_name
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[Quote_Number]",
              row.title
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.description = _.replace(
              emailOptionsLocal.description,
              "[VIEW_LINK]",
              process.env.APP_URL +
                "audit-request?type=viewSla&audit_id=" +
                row._id
            );
            emailOptionsLocal.toEmail = adminDetails.email;
            sendMail(emailOptionsLocal);
          }

          Audits.updateOne(
            { _id: row._id },
            {
              reminderInfo: {
                lastReminderDate: currentDate,
                nextReminderDate: nextReminderDate,
                reminderCount: reminderCount,
              },
            }
          )
            .then((obj) => {
              //console.log('Updated - ' + obj);
            })
            .catch((err) => {
              //console.log('Error: ' + err);
            });
        });
        return res.json(responseData("DATA_RECEIVED", data.data));
      }
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  AUDIT_DELETE: async (req, res) => {
    try {
      //const data = await Audits.find({ status: "AU_GOVERNMENT" }).lean();
      const data = await Audits.find().lean();
      console.log("data ==>", data);
      return res.json(responseData("DATA_RECEIVED", 1));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
};
