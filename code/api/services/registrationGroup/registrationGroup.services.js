const RegistrationGroup = require("../../models/RegistrationGroup");
const DocumentType = require("../../models/DocumentType");
const Users = require("../../models/User");
const { responseData } = require("../../helpers/responseData");
const { response } = require("../../resources/response");
const _ = require("lodash");
const Promise = require("bluebird");

module.exports = {
  index: async (req, res) => {
    try {
      let { page, sort, direction, keyword, status } = req.query;
      const sortOptions = {
        [sort || "title"]: direction ? (direction === "desc" ? 1 : -1) : 1,
      };
      const options = {
        page: page || 1,
        limit: process.env.ADMIN_LIST_PAGING_LIMIT || 20,
        sort: sortOptions,
        select: ["title", "updated_at", "status", "slug", "is_default", "type"],
      };
      var query = {};
      if (status) {
        query.status = status;
      }
      if (keyword) {
        query = { title: { $regex: _.trim(keyword), $options: "i" } };
      }
      RegistrationGroup.paginate(query, options, async function (err, result) {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        }
        const data = await response(result);
        return res.json(responseData("DATA_RECEIVED", data));
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  create: async (req, res) => {
    try {
      const { title, is_default, type } = req.body;
      var createObj = new RegistrationGroup();
      createObj.title = title;
      createObj.is_default = is_default;
      createObj.type = type.toUpperCase();
      createObj.save(function (err) {
        if (err) {
          for (prop in err.errors) {
            var str = err.errors[prop].message;
            return res.status(422).json(responseData(str, {}, 422));
          }
        } else {
          return res.json(responseData("GROUP_CREATED"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  delete: async (req, res) => {
    try {
      let { id } = req.query;
      await RegistrationGroup.remove({ _id: id }, async (err, result) => {
        await DocumentType.remove(
          { registration_group_id: id },
          (err, result) => {
            return res.json(responseData("REGISTRATIION_DELETE"));
          }
        );
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  update: async (req, res) => {
    try {
      let { title, id, is_default, type } = req.body;
      let updateObj = {};
      updateObj.title = title;
      updateObj.is_default = is_default;
      updateObj.type = type.toUpperCase();
      await RegistrationGroup.findOneAndUpdate(
        { _id: id },
        updateObj,
        (err) => {
          if (err) {
            for (prop in err.errors) {
              var str = err.errors[prop].message;
              return res.status(422).json(responseData(str, {}, 422));
            }
          }
          return res.json(responseData("GROUP_UPDATE"));
        }
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  process: async (req, res) => {
    try {
      let { id, status } = req.query;
      await RegistrationGroup.findOneAndUpdate(
        { _id: id },
        { status: status },
        (err, result) => {
          var stateMessage = "REGISTRATIION_DEACTIVE_STATE";
          if (parseInt(status)) {
            var stateMessage = "REGISTRATIION_ACTIVE_STATE";
          }
          return res.json(responseData(stateMessage));
        }
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  getList: async (req, res) => {
    try {
      let { type } = req.query;
      var queryString = ["VERIFICATION", "BOTH"];
      if (type === "CERTIFICATION") {
        queryString = ["CERTIFICATION", "BOTH"];
      }
      var condition = { status: 1 };
      if (type === "CERTIFICATION") {
        condition = { status: 1, type: "Company" };
      }

      const documentType = await DocumentType.find(condition)
        .sort({ name: 1 })
        .select({
          _id: 1,
          title: 1,
          extension: 1,
          type: 1,
          documentType: 1,
          description: 1,
          status: 1,
        })
        .populate("registration_group_id", "title")
        .lean();

      const registrationArray = [];
      var itemsObj = {};
      for (var i = 0; i < documentType.length; i++) {
        var item = documentType[i].registration_group_id;
        if (!itemsObj[item._id]) {
          itemsObj[item._id] = item._id;
          registrationArray.push(item._id);
        }
      }

      var registration = await RegistrationGroup.aggregate([
        { $sort: { title: 1 } },
        {
          $lookup: {
            from: "documenttypes",
            localField: "_id",
            foreignField: "registration_group_id",
            as: "document",
          },
        },
        { $unwind: "$document" },
        {
          $match: {
            status: 1,
            _id: { $in: registrationArray },
            type: { $in: queryString },
            "document.status": 1,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            "document._id": 1,
            "document.extension": 1,
            "document.type": 1,
            "document.title": 1,
            "document.title": 1,
            "document.documentType": 1,
            "document.status": 1,
            "document.description": 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            document: { $push: "$document" },
          },
        },
      ]);

      if (type === "CERTIFICATION") {
        registration = await RegistrationGroup.aggregate([
          { $sort: { title: 1 } },
          {
            $lookup: {
              from: "documenttypes",
              localField: "_id",
              foreignField: "registration_group_id",
              as: "document",
            },
          },
          { $unwind: "$document" },
          {
            $match: {
              status: 1,
              _id: { $in: registrationArray },
              type: { $in: queryString },
              "document.status": 1,
              "document.type": "Company",
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              "document._id": 1,
              "document.extension": 1,
              "document.type": 1,
              "document.title": 1,
              "document.title": 1,
              "document.documentType": 1,
              "document.status": 1,
              "document.description": 1,
            },
          },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              document: { $push: "$document" },
            },
          },
        ]);
      }

      await Promise.map(registration, async (item) => {
        var document = item.document;
        var rows = [];
        for (var i = 0; i < document.length; i++) {
          var data = document[i];
          var obj = {};
          obj._id = item._id;
          obj.title = item.title;
          data.registration_group_id = obj;
        }
        return item;
      });

      const company = await Users.find({ status: 1, role_id: 3 })
        .sort({ company_name: 1 })
        .select({ _id: 1, company_name: 1, abn_number: 1 })
        .lean();
      await Promise.map(company, async (item) => {
        item.title = item.company_name + "( " + item.abn_number + " )";
        return item;
      });

      /**
       * Default Selected Document
       */

      const selectedDocument = await RegistrationGroup.find({
        status: 1,
        is_default: true,
        _id: { $in: registrationArray },
        type: { $in: queryString },
      })
        .sort({ title: 1 })
        .select({ _id: 1 })
        .lean();

      /**
       * Default Selected Document type
       */
      const documentTypeArray = [];
      selectedDocument.forEach(function (selectedItem) {
        documentTypeArray.push(selectedItem._id);
      });

      var selectedCondition = {
        status: 1,
        registration_group_id: { $in: documentTypeArray },
      };
      if (type === "CERTIFICATION") {
        selectedCondition = {
          status: 1,
          type: "Company",
          registration_group_id: { $in: documentTypeArray },
        };
      }

      const selectedDocumentType = await DocumentType.find(selectedCondition)
        .sort({ name: 1 })
        .select({
          _id: 1,
        })
        .lean();

      return res.json(
        responseData("DATA_RECEIVED", {
          registration: registration,
          company: company,
          documentType: registration.length > 0 ? documentType : [],
          selectedDocument: registration.length > 0 ? selectedDocument : [],
          selectedDocumentType:
            registration.length > 0 ? selectedDocumentType : [],
        })
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
};
