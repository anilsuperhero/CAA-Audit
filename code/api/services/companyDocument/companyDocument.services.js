const CompanyDocument = require("../../models/CompanyDocument");
const AuditRequest = require("../../models/Audits");
const { responseData } = require("../../helpers/responseData");
const { response } = require("../../resources/response");
const _ = require("lodash");
const config = require("../../config/config");
const Promise = require("bluebird");
const { saveFile, documentPath, removeFile } = require("../../helpers/helpers");
const mongoose = require("mongoose");

module.exports = {
  index: async (req, res) => {
    try {
      var CompanyId = req.user_id;
      let { page, sort, direction, keyword, status, companyId, audit_id } =
        req.query;
      if (companyId) {
        CompanyId = companyId;
      }
      const sortOptions = {
        [sort || "created_at"]: direction === "desc" ? 1 : -1,
      };
      const options = {
        page: page || 1,
        limit: process.env.ADMIN_LIST_PAGING_LIMIT || 20,
        sort: sortOptions,
        select: [
          "title",
          "updated_at",
          "status",
          "description",
          "image",
          "document_name",
        ],
      };
      var query = {};
      if (status) {
        query.status = status;
      }
      if (keyword) {
        query.title = { $regex: _.trim(keyword), $options: "i" };
      }
      query.company_id = CompanyId;
      query.audit_id = audit_id;
      CompanyDocument.paginate(query, options, async function (err, result) {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }
        const data = await response(result);
        await Promise.map(data.data, async (item) => {
          var image = await documentPath(
            config.COMPANY_DOCUMENT + CompanyId,
            item.image
          );
          item.image = image;
          return item;
        });
        return res.json(responseData("DATA_RECEIVED", data));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  create: async (req, res) => {
    try {
      const { title, description, audit_id } = req.body;
      const files = req.files;
      const CompanyId = req.user_id;

      await AuditRequest.findOne(
        { _id: audit_id },
        { _id: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          }
        }
      );

      var companyDocument = new CompanyDocument();
      companyDocument.company_id = CompanyId;
      companyDocument.audit_id = audit_id;
      companyDocument.title = title;
      companyDocument.description = description;
      if (files && files.image.name != undefined) {
        var file = await saveFile(
          files.image,
          config.COMPANY_DOCUMENT + audit_id,
          ""
        );
        companyDocument.image = file;
        companyDocument.document_name = files.image.name;
      }
      companyDocument.save(async function (err) {
        if (err) {
          for (prop in err.errors) {
            var str = err.errors[prop].message;
            return res.status(422).json(responseData(str, {}, 422));
          }
        } else {
          await AuditRequest.updateOne(
            { _id: audit_id },
            { is_document: true }
          );
          return res.json(responseData("DOCUMENT_CREATED"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  delete: async (req, res) => {
    try {
      let { id } = req.query;
      CompanyDocument.findOne({ _id: id }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          const count = await CompanyDocument.countDocuments({
            audit_id: result.audit_id,
          }).exec();
          if (count === 1) {
            await AuditRequest.updateOne(
              { _id: new mongoose.Types.ObjectId(result.audit_id) },
              { is_document: false }
            );
          }

          await removeFile(
            config.COMPANY_DOCUMENT + result.audit_id,
            result.image
          );
          await CompanyDocument.remove({ _id: id }, (err, result) => {
            return res.json(responseData("DOCUMENT_DELETE"));
          });
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  update: async (req, res) => {
    try {
      const { title, description, id, audit_id } = req.body;
      const files = req.files;
      const CompanyId = req.user_id;
      await CompanyDocument.findOne(
        { _id: id },
        { _id: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          }
        }
      );

      let updateObj = {};
      updateObj.company_id = CompanyId;
      updateObj.audit_id = audit_id;
      updateObj.title = title;
      updateObj.description = description;

      if (files && files.image.name != undefined) {
        var file = await saveFile(
          files.image,
          config.COMPANY_DOCUMENT + audit_id,
          document.image
        );
        updateObj.image = file;
        updateObj.document_name = files.image.name;
      }
      await CompanyDocument.updateOne({ _id: id }, updateObj, (err, result) => {
        if (err) {
          for (prop in err.errors) {
            var str = err.errors[prop].message;
            return res.status(422).json(responseData(str, {}, 422));
          }
        }
        return res.json(responseData("DOCUMENT_UPDATE"));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
};
