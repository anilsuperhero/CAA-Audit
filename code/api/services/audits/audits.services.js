const Audits = require("../../models/Audits");
const AuditLog = require("../../models/AuditLog");
const ReportLog = require("../../models/ReportLog");
const AuditDocument = require("../../models/auditDocument");
const Promise = require("bluebird");
const { responseData } = require("../../helpers/responseData");
const Users = require("../../models/User");
const { response } = require("../../resources/response");
const config = require("../../config/config");
const { listTree } = require("../../helpers/helpers");
var email_service = require("../email/email.services");
const mongoose = require("mongoose");
var moment = require("moment");

const {
  sendNotification,
  generateOTP,
  imageURL,
  documentURL,
  saveFile,
  sendMail,
  documentPath,
  ucfirst,
} = require("../../helpers/helpers");
const _ = require("lodash");

module.exports = {
  index: async (req, res) => {
    try {
      const CompanyId = req.user_id;
      let {
        page,
        sort,
        direction,
        keyword,
        status,
        created_at_from,
        created_at_to,
      } = req.query;
      keyword = _.trim(keyword);
      var regexString = "";
      const sortOptions = {
        [sort || "updated_at"]: direction === "desc" ? 1 : -1,
      };
      const options = {
        page: page || 1,
        limit: process.env.ADMIN_LIST_PAGING_LIMIT || 20,
        sort: sortOptions,
      };
      var match = {};
      if (keyword) {
        var terms = keyword.split(" ");
        for (var i = 0; i < terms.length; i++) {
          regexString += terms[i];
          if (i < terms.length - 1) regexString += "|";
        }
        match = {
          $or: [
            { title: { $regex: regexString, $options: "i" } },
            { type: { $regex: regexString, $options: "i" } },
            { audit_number: { $regex: regexString, $options: "i" } },
            { "users.company_name": { $regex: regexString, $options: "i" } },
          ],
        };
      }
      if (status) {
        match.status = {
          $in: [status],
        };
      }
      if (created_at_from && created_at_to) {
        match.updated_at = {
          $gte: new Date(created_at_from),
          $lte: new Date(created_at_to + "T23:59:00.000Z"),
        };
      } else if (created_at_from) {
        match.updated_at = {
          $gte: new Date(created_at_from + "T00:00:00.000Z"),
        };
      } else if (created_at_to) {
        match.updated_at = {
          $lte: new Date(created_at_to + "T23:59:00.000Z"),
        };
      }
      match.company_id = new mongoose.Types.ObjectId(CompanyId);
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
            sla_document_sign: { $first: "$sla_document_sign" },
            sla_document_sign_name: { $first: "$sla_document_sign_name" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            sign_type: { $first: "$sign_type" },
            is_advance: { $first: "$is_advance" },
            is_final: { $first: "$is_final" },
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
            required_additional_doc: { $first: "$required_additional_doc" },
            required_additional_doc_company: {
              $first: "$required_additional_doc_company",
            },
            company: {
              $first: {
                name: "$users.company_name",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
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
      await Promise.map(data.data, async (item) => {
        var image = await imageURL(item.company.logo);
        var SLA_DOCUMENT = await documentURL(item.sla_document);
        var INVOICE = await documentURL(item.invoice_document);
        var sla_document_sign = await documentURL(item.sla_document_sign);
        var reportFile = await documentPath(
          config.REPORT_DOCUMENT + item._id,
          item.report
        );
        var reportStageFile = await documentPath(
          config.REPORT_DOCUMENT + item._id,
          item.report_stage
        );

        item.title = ucfirst(item.title);
        item.company.logo = image;
        item.report = reportFile;
        item.report_stage = reportStageFile;
        item.sla_document = SLA_DOCUMENT;
        item.invoice_document = INVOICE;
        item.sla_document_sign = sla_document_sign;
        item.type = config.AUDIT_TYPE_ARRAY[item.type];
        item.status_view = config.AUDIT_STATUS_ARRAY[item.status_view];
        item.sign_type = config.DOCUMENT_SING_ARRAY[item.sign_type];
        return item;
      });
      return res.json(responseData("DATA_RECEIVED", data));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  create: async (req, res) => {
    try {
      const request = req.body;
      const files = req.files;
      const CompanyId = request.company_id;
      const registrationArray = [];
      const documentArray = [];
      const itemsObj = {};
      const entries = [];
      const registrationGroup = [];

      for (var i = 0; i < JSON.parse(request.selectedDocument).length; i++) {
        var item = JSON.parse(request.selectedDocument)[i];
        var newObj = item;
        var groupObj = {};
        groupObj.id = item.registration_group_id._id;
        groupObj.title = item.registration_group_id.title;
        groupObj.documents = {};
        groupObj.documents.company = [];
        if (request.type === "VERIFICATION") {
          groupObj.documents.staff = [];
        }
        entries.push(newObj);
        registrationGroup.push(groupObj);
        documentArray.push(item._id);
        if (!itemsObj[item.registration_group_id._id]) {
          itemsObj[item.registration_group_id._id] =
            item.registration_group_id._id;
          registrationArray.push(item.registration_group_id._id);
        }
      }
      const result = registrationGroup.filter((v, i) => {
        return registrationGroup.map((val) => val.title).indexOf(v.title) === i;
      });
      const documentData = await listTree(entries, result);
      const auditNumber = "" + generateOTP() + generateOTP();
      var audits = new Audits();

      const reminderInfo = {};
      reminderInfo.lastReminderDate = "";
      reminderInfo.nextReminderDate = moment()
        .add(5, "days")
        .format("DDMMYYYY");
      reminderInfo.reminderCount = 0;

      audits.reminderInfo = reminderInfo;
      audits.title = request.title;
      audits.company_id = CompanyId;
      audits.audit_number = auditNumber;
      audits.type = request.type;
      audits.size_of_company = request.size_of_company;
      audits.number_of_clients = request.number_of_clients;
      audits.remarks = request.remarks;
      audits.sign_type = "NO";
      audits.amount = request.amount;
      if (request.type === "CERTIFICATION") {
        audits.advance_payment = request.advance_payment;
        audits.final_payment = request.final_payment;
      }
      audits.registration_group = JSON.parse(request.registration_group);
      audits.selectedDocument = documentData;
      audits.invoice_number = request.invoice_number;
      audits.status = "CREATED";
      audits.status_view = "CREATED";

      if (files && files.sla_document.name != undefined) {
        var file = await saveFile(files.sla_document, config.DOCUMENT, "");
        audits.sla_document_name = files.sla_document.name;
        audits.sla_document = file;
        audits.sla_document_old = file;
      }

      if (files && files.invoice.name != undefined) {
        var file = await saveFile(files.invoice, config.DOCUMENT, "");
        audits.invoice_document_name = files.invoice.name;
        audits.invoice_document = file;
        audits.invoice_document_old = file;
      }

      await audits.save(async function (err, result) {
        if (err) {
          for (prop in err.errors) {
            var str = err.errors[prop].message;
            return res.status(422).json(responseData(str, {}, 422));
          }
        } else {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = result._id;
          auditLog.audit_number = result.audit_number;
          auditLog.company_id = result.company_id;
          auditLog.type = result.type.toUpperCase();
          auditLog.status = "CREATED";
          auditLog.save();

          /**
           * Send notification to user
           */
          var users = await Users.findOne({ _id: CompanyId });
          var message =
            "Admin has been create audit request and sent a SLA document. Your audit request reference number is #" +
            result.title;

          var notification = {};
          notification.user = users;
          notification.message = message;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + result._id;
          notification.title = "Audit Request";
          notification.isMail = false;
          sendNotification(notification);

          /**
           * Send Email
           */
          var options = await email_service.getEmailTemplateBySlug("new-audit");
          options.description = _.replace(
            options.description,
            "[Name]",
            users.company_name
          );
          options.description = _.replace(
            options.description,
            "[Audit_Type]",
            result.type
          );
          options.description = _.replace(
            options.description,
            "[Quote_number]",
            result.title
          );
          options.description = _.replace(
            options.description,
            "[LINK]",
            process.env.APP_URL +
              "user/dashboard?type=viewSla&audit_id=" +
              result._id
          );
          options.description = _.replace(
            options.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "user/dashboard?type=viewSla&audit_id=" +
              result._id
          );
          options.toEmail = users.email;
          sendMail(options);
          return res.json(responseData("REQUEST_CREATED"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  delete: async (req, res) => {
    try {
      let { id } = req.query;
      await Audits.deleteOne({ _id: id }, async (err, result) => {
        await AuditLog.deleteMany({ audit_id: id });
        return res.json(responseData("REQUEST_DELETE"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  indexAdmin: async (req, res) => {
    try {
      let {
        page,
        sort,
        direction,
        keyword,
        status,
        created_at_from,
        created_at_to,
      } = req.query;
      keyword = _.trim(keyword);
      var regexString = "";
      const sortOptions = {
        [sort || "updated_at"]: direction === "desc" ? 1 : -1,
      };
      const options = {
        page: page || 1,
        limit: process.env.ADMIN_LIST_PAGING_LIMIT || 20,
        sort: sortOptions,
      };
      var match = {};

      if (keyword) {
        var terms = keyword.split(" ");
        for (var i = 0; i < terms.length; i++) {
          regexString += terms[i];
          if (i < terms.length - 1) regexString += "|";
        }
        match = {
          $or: [
            { title: { $regex: regexString, $options: "i" } },
            { type: { $regex: regexString, $options: "i" } },
            { audit_number: { $regex: regexString, $options: "i" } },
            { "users.company_name": { $regex: regexString, $options: "i" } },
          ],
        };
      }
      if (status) {
        match.status = {
          $in: [status],
        };
      }
      if (created_at_from && created_at_to) {
        match.updated_at = {
          $gte: new Date(created_at_from),
          $lte: new Date(created_at_to + "T23:59:00.000Z"),
        };
      } else if (created_at_from) {
        match.updated_at = {
          $gte: new Date(created_at_from + "T00:00:00.000Z"),
        };
      } else if (created_at_to) {
        match.updated_at = {
          $lte: new Date(created_at_to + "T23:59:00.000Z"),
        };
      }

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
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
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
      await Promise.map(data.data, async (item) => {
        var image = await imageURL(item.company.logo);
        var SLA_DOCUMENT = await documentURL(item.sla_document);
        var INVOICE = await documentURL(item.invoice_document);
        var sla_document_sign = await documentURL(item.sla_document_sign);
        var reportFile = await documentPath(
          config.REPORT_DOCUMENT + item._id,
          item.report
        );

        var reportStageFile = await documentPath(
          config.REPORT_DOCUMENT + item._id,
          item.report_stage
        );

        item.title = ucfirst(item.title);
        item.company.logo = image;
        item.sla_document = SLA_DOCUMENT;
        item.invoice_document = INVOICE;
        item.sla_document_sign = sla_document_sign;
        item.report_stage = reportStageFile;
        item.type = config.AUDIT_TYPE_ARRAY[item.type];
        item.status_view = config.AUDIT_STATUS_ARRAY_ADMIN[item.status_view];
        item.sign_type = config.DOCUMENT_SING_ARRAY[item.sign_type];
        item.report = reportFile;
        return item;
      });
      return res.json(responseData("DATA_RECEIVED", data));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  assign: async (req, res) => {
    try {
      const { id, lead, peer, support, startDate, endDate } = req.body;
      await Audits.findOne({ _id: id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }

        var request = {};
        request.lead = lead;
        if (auditData.is_stage) {
          if (!auditData.startDateStage) {
            request.status = "STAGE_CONFORM";
            request.status_view = "STAGE_CONFORM";
          }
        } else {
          if (!auditData.is_auditor) {
            request.status = "AUDIT_DATE_BOOK";
            request.status_view = "AUDIT_DATE_BOOK";
          }
        }

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = "";
        reminderInfo.reminderCount = 0;
        request.reminderInfo = reminderInfo;

        if (!auditData.is_auditor) {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = auditData._id;
          auditLog.audit_number = auditData.audit_number;
          auditLog.company_id = auditData.company_id;
          auditLog.type = auditData.type.toUpperCase();
          auditLog.status = "AUDIT_DATE_BOOK";
          auditLog.save();
        }

        if (auditData.is_stage) {
          request.startDateStage = startDate;
          request.endDateStage = endDate;
        } else {
          request.startDate = startDate;
          request.endDate = endDate;
        }
        if (support) {
          request.support = support;
        } else {
          request.support = null;
        }
        if (peer) {
          request.peer = peer;
        } else {
          request.peer = null;
        }

        if (!auditData.startDateStage && auditData.is_auditor) {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = auditData._id;
          auditLog.audit_number = auditData.audit_number;
          auditLog.company_id = auditData.company_id;
          auditLog.type = auditData.type.toUpperCase();
          auditLog.status = "STAGE_CONFORM";
          auditLog.save();
        }

        request.is_auditor = true;
        await Audits.updateOne({ _id: id }, request);
        var audit_date = `${startDate} To ${endDate}`;
        /**
         * Send email to user
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var message =
          "Admin has audit date booked for quote reference number #" +
          auditData.title +
          " scheduled on " +
          audit_date;
        if (auditData.is_stage) {
          message =
            "Admin has audit date booked for quote reference number #" +
            auditData.title +
            " scheduled on " +
            audit_date;
        }
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.isMail = true;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Auditor Assign";
        sendNotification(notification);

        /**
         * Send Email for lead auditor
         */
        if (lead) {
          var leadUsers = await Users.findOne({ _id: lead });
          var message =
            "Admin has audit date booked for quote reference number #" +
            auditData.title +
            " scheduled on " +
            audit_date;
          if (auditData.is_stage) {
            var message =
              "Admin has audit date booked for quote reference number #" +
              auditData.title +
              " scheduled on " +
              audit_date;
          }
          var notification = {};
          notification.user = leadUsers;
          notification.message = message;
          notification.isMail = false;
          notification.action =
            "auditor/audit-request?type=viewDetails&audit_id=" + auditData._id;
          notification.title = "Audit Assign";
          sendNotification(notification);

          var options = await email_service.getEmailTemplateBySlug(
            "new-audit-request-for-auditor"
          );
          options.description = _.replace(
            options.description,
            "[FirstName]",
            leadUsers.first_name
          );
          options.description = _.replace(
            options.description,
            "[LastName]",
            leadUsers.last_name
          );
          options.description = _.replace(
            options.description,
            "[Company_name]",
            users.company_name
          );
          options.description = _.replace(
            options.description,
            "[Quote_number]",
            auditData.title
          );
          options.description = _.replace(
            options.description,
            "[LINK]",
            process.env.APP_URL +
              "auditor/audit-request?type=viewDetails&audit_id=" +
              auditData._id
          );
          options.description = _.replace(
            options.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "auditor/audit-request?type=viewDetails&audit_id=" +
              auditData._id
          );
          options.toEmail = leadUsers.email;
          sendMail(options);
        }

        /**
         * Send email for peer auditor
         */
        if (peer) {
          var peerUsers = await Users.findOne({ _id: peer });
          var message =
            "Admin has audit date booked for quote reference number #" +
            auditData.title +
            " scheduled on " +
            audit_date;
          if (auditData.is_stage) {
            var message =
              "Admin has audit date booked for quote reference number #" +
              auditData.title +
              " scheduled on " +
              audit_date;
          }
          var notification = {};
          notification.user = peerUsers;
          notification.message = message;
          notification.isMail = false;
          notification.action =
            "auditor/audit-request?type=viewDetails&audit_id=" + auditData._id;
          notification.title = "Audit Assign";
          sendNotification(notification);

          var options = await email_service.getEmailTemplateBySlug(
            "new-audit-request-for-auditor"
          );
          options.description = _.replace(
            options.description,
            "[FirstName]",
            peerUsers.first_name
          );
          options.description = _.replace(
            options.description,
            "[LastName]",
            peerUsers.last_name
          );
          options.description = _.replace(
            options.description,
            "[Company_name]",
            users.company_name
          );
          options.description = _.replace(
            options.description,
            "[Quote_number]",
            auditData.title
          );
          options.description = _.replace(
            options.description,
            "[LINK]",
            process.env.APP_URL +
              "auditor/audit-request?type=viewDetails&audit_id=" +
              auditData._id
          );
          options.description = _.replace(
            options.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "auditor/audit-request?type=viewDetails&audit_id=" +
              auditData._id
          );
          options.toEmail = peerUsers.email;
          sendMail(options);
        }

        /**
         * Send email for support auditor
         */
        if (support) {
          var supportUsers = await Users.findOne({ _id: support });
          var message =
            "Admin has audit date booked for quote reference number #" +
            auditData.title +
            " scheduled on " +
            audit_date;
          if (auditData.is_stage) {
            var message =
              "Admin has audit date booked for quote reference number #" +
              auditData.title +
              " scheduled on " +
              audit_date;
          }
          var notification = {};
          notification.user = supportUsers;
          notification.message = message;
          notification.isMail = false;
          notification.action =
            "auditor/audit-request?type=viewDetails&audit_id=" + auditData._id;
          notification.title = "Audit Assign";
          sendNotification(notification);

          var options = await email_service.getEmailTemplateBySlug(
            "new-audit-request-for-auditor"
          );
          options.description = _.replace(
            options.description,
            "[FirstName]",
            supportUsers.first_name
          );
          options.description = _.replace(
            options.description,
            "[LastName]",
            supportUsers.last_name
          );
          options.description = _.replace(
            options.description,
            "[Company_name]",
            users.company_name
          );
          options.description = _.replace(
            options.description,
            "[Quote_number]",
            auditData.title
          );
          options.description = _.replace(
            options.description,
            "[LINK]",
            process.env.APP_URL +
              "auditor/audit-request?type=viewDetails&audit_id=" +
              auditData._id
          );
          options.description = _.replace(
            options.description,
            "[VIEW_LINK]",
            process.env.APP_URL +
              "auditor/audit-request?type=viewDetails&audit_id=" +
              auditData._id
          );
          options.toEmail = supportUsers.email;
          sendMail(options);
        }
        return res.json(responseData("AUDITORS_ASSIGNED"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  slaUpload: async (req, res) => {
    try {
      const {
        _id,
        amount,
        remarks,
        sla_document_old,
        final_payment,
        advance_payment,
      } = req.body;
      const files = req.files;
      await Audits.findOne({ _id: _id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }

        var request = {};
        request.amount = amount;
        if (auditData.type === "Verification") {
          request.advance_payment = advance_payment;
          request.final_payment = final_payment;
        }
        request.remarks = remarks;
        request.status = "SLAUPLOADED";
        request.status_view = "SLAUPLOADED";
        if (files && files.sla_document.name != undefined) {
          var file = await saveFile(
            files.sla_document,
            config.DOCUMENT,
            sla_document_old
          );
          request.sla_document_name = files.sla_document.name;
          request.sla_document = file;
          request.sla_document_old = file;
        }
        await Audits.updateOne({ _id: _id }, request);

        /**
         * Send email to user
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var message =
          "Admin has been sent a SLA documents. Your audit request reference number is #" +
          auditData.title;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("DOCUMENT_UPLOAD"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  slaSignature: async (req, res) => {
    try {
      const { _id, sla_document_sign_old } = req.body;
      const files = req.files;
      await Audits.findOne({ _id: _id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }
        var request = {};
        request.status = "SLASIGNED";
        request.status_view = "SLASIGNED";

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = moment()
          .add(1, "days")
          .format("DDMMYYYY");
        reminderInfo.reminderCount = 0;

        request.reminderInfo = reminderInfo;

        if (files && files.sla_document_sign.name != undefined) {
          var file = await saveFile(
            files.sla_document_sign,
            config.DOCUMENT,
            sla_document_sign_old
          );
          request.sla_document_sign_name = files.sla_document_sign.name;
          request.sla_document_sign = file;
          request.sla_document_sign_old = file;
          request.sign_type = "SELF";
        }
        await Audits.updateOne({ _id: _id }, request);

        /**
         * Save log
         */
        var auditLog = new AuditLog();
        auditLog.audit_id = auditData._id;
        auditLog.audit_number = auditData.audit_number;
        auditLog.company_id = auditData.company_id;
        auditLog.type = auditData.type.toUpperCase();
        auditLog.status = "SLASIGNED";
        auditLog.save();

        /**
         * Send email and notification to user
         */

        var users = await Users.findOne({ _id: auditData.company_id });
        var message =
          "You have signed successfully agreement document for. audit reference number is #" +
          auditData.title;

        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "/audit-request?type=viewSla&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        /**
         * Send email to admin
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var admin = await Users.findOne({ role_id: 1 });
        var message =
          users.company_name +
          " has been signed a SLA document for audit reference number is #" +
          auditData.title;

        var notification = {};
        notification.user = admin;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("DOCUMENT_SIGNED"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  docuSign: async (req, res) => {
    try {
      const { state } = req.query;
      await Audits.findOne({ audit_number: state }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }
        var request = {};
        request.status = "SLASIGNED";
        request.status_view = "SLASIGNED";
        request.sign_type = "DOCUSIGN";

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = moment()
          .add(1, "days")
          .format("DDMMYYYY");
        reminderInfo.reminderCount = 0;
        request.reminderInfo = reminderInfo;

        await Audits.updateOne({ _id: auditData._id }, request);

        /**
         * Save log
         */
        var auditLog = new AuditLog();
        auditLog.audit_id = auditData._id;
        auditLog.audit_number = auditData.audit_number;
        auditLog.company_id = auditData.company_id;
        auditLog.type = auditData.type.toUpperCase();
        auditLog.status = "SLASIGNED";
        auditLog.save();

        /**
         * Send notification to user
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var message =
          "You have signed successfully agreement document for. audit reference number is #" +
          auditData.title;

        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "/audit-request?type=viewSla&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        /**
         * Send email to admin
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var admin = await Users.findOne({ role_id: 1 });
        var message =
          users.company_name +
          " has been signed a SLA document using docuSing for audit reference number is #" +
          auditData.title;

        var notification = {};
        notification.user = admin;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("DOCUMENT_SIGNED"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  documentList: async (req, res) => {
    try {
      let { slug } = req.query;
      const count = await AuditDocument.countDocuments({
        auditId: slug,
        status: { $in: [2, 6] },
      }).exec();

      const onGoingDocument = await AuditDocument.countDocuments({
        auditId: slug,
        status: { $in: [4] },
      }).exec();

      await Audits.updateOne(
        { _id: slug },
        { uploaded_document: count, onGoing: onGoingDocument }
      );
      const auditRequest = await Audits.findOne({ _id: slug })
        .populate("company_id", "abn_number company_name _id")
        .select({
          _id: 1,
          title: 1,
          extension: 1,
          type: 1,
          audit_number: 1,
          selectedDocument: 1,
          keyStaff: 1,
          total_document: 1,
          uploaded_document: 1,
          is_request: 1,
          lead: 1,
          peer: 1,
          support: 1,
          company_id: 1,
          isCertification: 1,
          onGoing: 1,
        })
        .lean();
      if (!auditRequest) {
        return res.json(responseData("DATA_RECEIVED", auditRequest));
      }
      if (
        auditRequest.total_document <= auditRequest.uploaded_document &&
        auditRequest.total_document !== 0
      ) {
        const auditLogCount = await AuditLog.countDocuments({
          audit_id: auditRequest._id,
          status: "DOCUMENT",
        }).exec();

        if (auditLogCount === 0) {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = auditRequest._id;
          auditLog.audit_number = auditRequest.audit_number;
          auditLog.company_id = auditRequest.company_id;
          auditLog.type = auditRequest.type.toUpperCase();
          auditLog.status = "DOCUMENT";
          auditLog.save();

          await Audits.updateOne(
            { _id: slug },
            {
              status: "DOCUMENT",
              status_view: "DOCUMENT",
              documentComplete: moment(),
            }
          );

          /**
           * Sent user Notification
           */
          var users = await Users.findOne({ _id: auditRequest.company_id });
          var message =
            "You have successfully uploaded all documents for audit request reference number is #" +
            auditRequest.title;

          var notification = {};
          notification.user = users;
          notification.message = message;
          notification.action =
            "/audit-request?type=viewSla&audit_id=" + auditRequest._id;
          notification.title = "Audit Request";
          notification.isMail = true;
          sendNotification(notification);
        }
      }
      return res.json(responseData("DATA_RECEIVED", auditRequest));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  indexAuditor: async (req, res) => {
    try {
      let {
        page,
        sort,
        direction,
        keyword,
        status,
        created_at_from,
        created_at_to,
      } = req.query;
      const auditorId = req.user_id;
      keyword = _.trim(keyword);
      var regexString = "";
      const sortOptions = {
        [sort || "updated_at"]: direction === "desc" ? 1 : -1,
      };
      const options = {
        page: page || 1,
        limit: process.env.ADMIN_LIST_PAGING_LIMIT || 20,
        sort: sortOptions,
      };
      var matchBasic = {
        $and: [
          {
            $or: [
              { lead: new mongoose.Types.ObjectId(auditorId) },
              { peer: new mongoose.Types.ObjectId(auditorId) },
              { support: new mongoose.Types.ObjectId(auditorId) },
            ],
          },
        ],
      };
      var match = {};
      if (keyword) {
        var terms = keyword.split(" ");
        for (var i = 0; i < terms.length; i++) {
          regexString += terms[i];
          if (i < terms.length - 1) regexString += "|";
        }
        match2 = {
          $or: [
            { title: { $regex: regexString, $options: "i" } },
            { type: { $regex: regexString, $options: "i" } },
            { audit_number: { $regex: regexString, $options: "i" } },
            { "users.company_name": { $regex: regexString, $options: "i" } },
          ],
        };

        matchBasic["$and"].push(match2);
      }
      var match = {};
      if (status) {
        match.status = {
          $in: [status],
        };
      }
      if (created_at_from && created_at_to) {
        match.updated_at = {
          $gte: new Date(created_at_from),
          $lte: new Date(created_at_to + "T23:59:00.000Z"),
        };
      } else if (created_at_from) {
        match.updated_at = {
          $gte: new Date(created_at_from + "T00:00:00.000Z"),
        };
      } else if (created_at_to) {
        match.updated_at = {
          $lte: new Date(created_at_to + "T23:59:00.000Z"),
        };
      }
      if (match) {
        matchBasic["$and"].push(match);
      }
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
        { $match: matchBasic },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
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
            is_document: { $first: "$is_document" },
            is_request: { $first: "$is_request" },
            audit_date: { $first: "$audit_date" },
            description: { $first: "$description" },
            remarks: { $first: "$remarks" },
            report: { $first: "$report" },
            report_name: { $first: "$report_name" },
            report_remarks: { $first: "$report_remarks" },
            invoice_number: { $first: "$invoice_number" },
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
            is_start: { $first: "$is_start" },
            required_additional_doc: { $first: "$required_additional_doc" },
            required_additional_doc_company: {
              $first: "$required_additional_doc_company",
            },
            company: {
              $first: {
                name: "$users.company_name",
                abn_number: "$users.abn_number",
                logo: "$users.image",
                id: "$users._id",
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
      await Promise.map(data.data, async (item) => {
        var image = await imageURL(item.company.logo);
        var reportFile = await documentPath(
          config.REPORT_DOCUMENT + item._id,
          item.report
        );
        var reportStageFile = await documentPath(
          config.REPORT_DOCUMENT + item._id,
          item.report_stage
        );

        item.company.logo = image;
        item.title = ucfirst(item.title);
        item.report = reportFile;
        item.report_stage = reportStageFile;
        item.type = config.AUDIT_TYPE_ARRAY[item.type];
        item.status_view = config.AUDIT_STATUS_ARRAY_AUDITOR[item.status_view];
        item.sign_type = config.DOCUMENT_SING_ARRAY[item.sign_type];
        return item;
      });
      return res.json(responseData("DATA_RECEIVED", data));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateRequest: async (req, res) => {
    try {
      let { audit_id, type, role } = req.body;

      const reminderInfo = {};
      reminderInfo.lastReminderDate = "";

      if (type === "SEND_PEER") {
        reminderInfo.nextReminderDate = moment()
          .add(2, "days")
          .format("DDMMYYYY");
      } else {
        reminderInfo.nextReminderDate = "";
      }
      reminderInfo.reminderCount = 0;
      var updateRequest = {};
      updateRequest.status = type;
      updateRequest.status_view = type;
      updateRequest.reminderInfo = reminderInfo;
      if (type === "PROGRESS") {
        updateRequest.is_start = true;
      }
      await Audits.updateOne({ _id: audit_id }, updateRequest);

      var auditData = await Audits.findOne(
        { _id: audit_id },
        {
          is_stage: 1,
          audit_number: 1,
          company_id: 1,
          _id: 1,
          type: 1,
          peer: 1,
          title: 1,
        }
      ).lean();

      if (
        type === "AU_GOVERNMENT" ||
        type === "PROGRESS" ||
        type === "PROGRESS_STAGE"
      ) {
        if (type === "AU_GOVERNMENT") {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = auditData._id;
          auditLog.audit_number = auditData.audit_number;
          auditLog.company_id = auditData.company_id;
          auditLog.type = auditData.type.toUpperCase();
          auditLog.status = type;
          auditLog.save();
        }

        if (auditData.type === "VERIFICATION") {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = auditData._id;
          auditLog.audit_number = auditData.audit_number;
          auditLog.company_id = auditData.company_id;
          auditLog.type = auditData.type.toUpperCase();
          auditLog.status = type;
          auditLog.save();
        }

        /**
         * Send notification to user
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var message = `Auditor has been updated status for audit quote number #${auditData.title}`;
        if (type === "AU_GOVERNMENT") {
          message = `Admin has report submitted to NDIA for audit quote number #${auditData.title}`;
        }
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);
      }

      if (type === "SEND_REPORT_COMPANY") {
        /**
         * Send notification to user
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var message = `Auditor has been sent audit stage 2 report for audit quote number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);
      }

      if (type === "SEND_PEER") {
        /**
         * Send notification to peer auditor
         */
        var users = await Users.findOne({ _id: auditData.peer });
        var message = `Lead auditor has sent report for audit quote number ${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);
      }

      if (role === 1) {
        /**
         * Send notification to admin
         */
        var users = await Users.findOne({ role_id: 1 });
        var message = `Auditor has been updated status for quote number ${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);
      }
      return res.json(responseData("AUDIT_UPLOAD"));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  uploadReport: async (req, res) => {
    try {
      const { audit_id, remarks, stage } = req.body;
      const files = req.files;
      var reportLog = new ReportLog();
      var request = {};
      await Audits.findOne({ _id: audit_id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }
        if (files && files.document.name != undefined) {
          var file = await saveFile(
            files.document,
            config.REPORT_DOCUMENT + audit_id,
            ""
          );
          if (parseInt(stage) === 1) {
            request.report_name = files.document.name;
            request.report = file;
          }
          if (parseInt(stage) === 2 || parseInt(stage) === 3) {
            request.report_name_stage = files.document.name;
            request.report_stage = file;
          }
          reportLog.report_name = files.document.name;
          reportLog.report = file;
        }
        if (parseInt(stage) === 1) {
          request.report_remarks = remarks;
          request.status = "REPORT_UPLOAD";
          request.status_view = "REPORT_UPLOAD";
        }
        if (parseInt(stage) === 2) {
          request.report_remarks_stage = remarks;
          request.status = "REPORT_UPLOAD_STAGE";
          request.status_view = "REPORT_UPLOAD_STAGE";
        }
        if (parseInt(stage) === 3) {
          request.report_remarks_stage = remarks;
          request.status = "REPORT_REVIEW";
          request.status_view = "REPORT_REVIEW";
        }

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = moment()
          .add(1, "day")
          .format("DDMMYYYY");
        reminderInfo.reminderCount = 0;

        await Audits.updateOne({ _id: audit_id }, request);

        reportLog.audit_id = auditData._id;
        reportLog.audit_number = auditData.audit_number;
        reportLog.company_id = auditData.company_id;
        reportLog.save();

        if (parseInt(stage) === 3) {
          /**
           * Send notification to lead auditor
           */
          var users = await Users.findOne({ _id: auditData.lead });
          var message = `Peer auditor has been reviewed report and uploaded report for quote reference number #${auditData.title}`;
          var notification = {};
          notification.user = users;
          notification.message = message;
          notification.action =
            "audit-request?type=viewDetails&audit_id=" + auditData._id;
          notification.title = "Audit Request";
          notification.isMail = true;
          sendNotification(notification);
        }

        /**
         * Send notification to admin
         */
        var users = await Users.findOne({ role_id: 1 });
        var message = `Auditor has been uploaded report for quote reference number #${auditData.title}`;
        if (parseInt(stage) === 3) {
          var message = `Peer auditor has been reviewed report and uploaded report for quote reference number #${auditData.title}`;
        }
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("REPORT_UPLOAD"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  rejectReport: async (req, res) => {
    try {
      const { audit_id, remarks } = req.body;
      var reportLog = new ReportLog();
      var request = {};
      await Audits.findOne({ _id: audit_id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }

        request.report_remarks = remarks;
        request.status = "REPORT_REJECT";
        request.status_view = "REPORT_REJECT";

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = "";
        reminderInfo.reminderCount = 0;
        request.reminderInfo = reminderInfo;

        await Audits.updateOne({ _id: audit_id }, request);

        reportLog.audit_id = auditData._id;
        reportLog.audit_number = auditData.audit_number;
        reportLog.status = "REJECT";
        reportLog.company_id = auditData.company_id;
        reportLog.report_remarks = remarks;
        reportLog.save();

        /**
         * Send notification to auditor
         */
        var companyData = await Users.findOne({ _id: auditData.company_id });
        var users = await Users.findOne({ _id: auditData.lead });
        var message = `${companyData.company_name} has been rejected report for audit reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        /**
         * Send notification to admin
         */
        var users = await Users.findOne({ role_id: 1 });
        var message = `${companyData.company_name} has been rejected report for audit reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("REPORT_REJECT"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  acceptReport: async (req, res) => {
    try {
      const { audit_id, remarks } = req.body;
      var reportLog = new ReportLog();
      var request = {};
      await Audits.findOne({ _id: audit_id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }
        request.status = "ACCEPT_REPORT";
        request.status_view = "ACCEPT_REPORT";

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = "";
        reminderInfo.reminderCount = 0;
        request.reminderInfo = reminderInfo;

        await Audits.updateOne({ _id: audit_id }, request);

        reportLog.audit_id = auditData._id;
        reportLog.audit_number = auditData.audit_number;
        reportLog.status = "ACCEPT";
        reportLog.company_id = auditData.company_id;
        reportLog.save();

        if (auditData.is_stage) {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = auditData._id;
          auditLog.audit_number = auditData.audit_number;
          auditLog.company_id = auditData.company_id;
          auditLog.type = auditData.type.toUpperCase();
          auditLog.status = "STAGE_COMPLETED";
          auditLog.save();

          var auditLog = new AuditLog();
          auditLog.audit_id = auditData._id;
          auditLog.audit_number = auditData.audit_number;
          auditLog.company_id = auditData.company_id;
          auditLog.type = auditData.type.toUpperCase();
          auditLog.status = "ACCEPT_REPORT_STAGE";
          auditLog.save();
        } else {
          /**
           * Save log
           */
          var auditLog = new AuditLog();
          auditLog.audit_id = auditData._id;
          auditLog.audit_number = auditData.audit_number;
          auditLog.company_id = auditData.company_id;
          auditLog.type = auditData.type.toUpperCase();
          auditLog.status = "ACCEPT_REPORT";
          auditLog.save();
        }

        /**
         * Send notification to auditor
         */
        var companyData = await Users.findOne({ _id: auditData.company_id });
        var users = await Users.findOne({ _id: auditData.lead });
        var message = `${companyData.company_name} has been accepted report for audit reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        /**
         * Send notification to admin
         */
        var users = await Users.findOne({ role_id: 1 });
        var message = `${companyData.company_name} has been accepted report for audit reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("ACCEPT_REPORT"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  rejectReportStage: async (req, res) => {
    try {
      const { audit_id, remarks } = req.body;
      var reportLog = new ReportLog();
      var request = {};
      await Audits.findOne({ _id: audit_id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }

        request.report_remarks = remarks;
        request.status = "REPORT_REJECT_STAGE";
        request.status_view = "REPORT_REJECT_STAGE";

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = "";
        reminderInfo.reminderCount = 0;
        request.reminderInfo = reminderInfo;

        await Audits.updateOne({ _id: audit_id }, request);

        reportLog.audit_id = auditData._id;
        reportLog.audit_number = auditData.audit_number;
        reportLog.status = "REJECT";
        reportLog.report_remarks = remarks;
        reportLog.company_id = auditData.company_id;
        reportLog.save();

        /**
         * Send notification to auditor
         */
        var companyData = await Users.findOne({ _id: auditData.company_id });
        var users = await Users.findOne({ _id: auditData.lead });
        var message = `${companyData.company_name} has been rejected report for audit reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        /**
         * Send notification to admin
         */
        var users = await Users.findOne({ role_id: 1 });
        var message = `${companyData.company_name} has been rejected report for audit reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("REPORT_REJECT"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  uploadReportNew: async (req, res) => {
    try {
      const { audit_id, remarks, stage } = req.body;
      const files = req.files;
      var reportLog = new ReportLog();
      var request = {};
      await Audits.findOne({ _id: audit_id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }
        if (files && files.document.name != undefined) {
          var file = await saveFile(
            files.document,
            config.REPORT_DOCUMENT + audit_id,
            ""
          );
          request.report_name_stage = files.document.name;
          request.report_stage = file;
          reportLog.report_name = files.document.name;
          reportLog.report = file;
        }
        request.report_remarks = remarks;
        request.status = "REPORT_UPLOAD";
        request.status_view = "REPORT_UPLOAD";

        const reminderInfo = {};
        reminderInfo.lastReminderDate = "";
        reminderInfo.nextReminderDate = "";
        reminderInfo.reminderCount = 0;
        request.reminderInfo = reminderInfo;

        await Audits.updateOne({ _id: audit_id }, request);

        reportLog.audit_id = auditData._id;
        reportLog.audit_number = auditData.audit_number;
        reportLog.company_id = auditData.company_id;
        reportLog.save();

        /**
         * Send notification to user
         */
        var users = await Users.findOne({ _id: auditData.company_id });
        var message = `Auditor has been uploaded report for quote reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        /**
         * Send notification to admin
         */
        var users = await Users.findOne({ role_id: 1 });
        var message = `Auditor has been uploaded report for quote reference number #${auditData.title}`;
        var notification = {};
        notification.user = users;
        notification.message = message;
        notification.action =
          "audit-request?type=viewDetails&audit_id=" + auditData._id;
        notification.title = "Audit Request";
        notification.isMail = true;
        sendNotification(notification);

        return res.json(responseData("REPORT_UPLOAD"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  documentRequest: async (req, res) => {
    try {
      const { audit_id } = req.query;

      await Audits.findOne({ _id: audit_id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          var request = {};
          request.required_additional_doc = true;

          const reminderInfo = {};
          reminderInfo.lastReminderDate = "";
          reminderInfo.nextReminderDate = moment()
            .add(3, "days")
            .format("DDMMYYYY");
          reminderInfo.reminderCount = 0;

          request.reminderInfo = reminderInfo;

          await Audits.updateOne({ _id: audit_id }, request);

          /**
           * Send notification to company
           */
          var users = await Users.findOne({ _id: auditData.company_id });
          var message = `Auditor has sent you a request for additional documents audit reference number #${auditData.title}`;
          var notification = {};
          notification.user = users;
          notification.message = message;
          notification.action =
            "audit-request?type=viewDetails&audit_id=" + auditData._id;
          notification.title = "Audit Request";
          notification.isMail = true;
          sendNotification(notification);
          return res.json(responseData("REQUEST_SEND"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  documentRequestCompany: async (req, res) => {
    try {
      const { id } = req.query;

      await Audits.findOne({ _id: id }, async (err, auditData) => {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          var request = {};
          request.required_additional_doc_company = true;
          request.required_additional_doc = false;
          const reminderInfo = {};
          reminderInfo.lastReminderDate = "";
          reminderInfo.nextReminderDate = "";
          reminderInfo.reminderCount = 0;
          request.reminderInfo = reminderInfo;

          await Audits.updateOne({ _id: id }, request);

          /**
           * Send email and notification to auditor
           */
          var companyData = await Users.findOne({ _id: auditData.company_id });
          var users = await Users.findOne({ _id: auditData.lead });
          var message = `${companyData.company_name} has been sent additional documents for audit reference number #${auditData.title}`;
          var notification = {};
          notification.user = users;
          notification.message = message;
          notification.action =
            "audit-request?type=viewDetails&audit_id=" + auditData._id;
          notification.title = "Audit Request";
          notification.isMail = true;
          sendNotification(notification);
          return res.json(responseData("REQUEST_SEND"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
};
