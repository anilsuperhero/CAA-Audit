const Users = require("../../models/User");
const Audits = require("../../models/Audits");
const AuditLog = require("../../models/AuditLog");
const { responseData } = require("../../helpers/responseData");
const bcrypt = require("bcryptjs");
const { saveFile, saveThumbFile } = require("../../helpers/helpers");
const config = require("../../config/config");
var moment = require("moment");

module.exports = {
  changePassword: async (req, res) => {
    try {
      const { current_password, password } = req.body;
      Users.findOne({ _id: req.user_id }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          const verified = bcrypt.compareSync(
            current_password,
            result.password
          );
          if (!verified) {
            return res
              .status(422)
              .json(responseData("CURRENT_PASSWORD_NOT_MATCH", {}, 422));
          } else {
            const passwordHash = bcrypt.hashSync(password, 10);
            var user = {};
            user.password = passwordHash;
            await Users.findOneAndUpdate(
              { _id: req.user_id },
              user,
              (err, result) => {
                if (err) {
                  for (prop in err.errors) {
                    var str = err.errors[prop].message;
                    return res.status(422).json(responseData(str, {}, 422));
                  }
                }
              }
            );
            return res.json(responseData("PASSWORD_UPDATE"));
          }
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateProfileAdmin: async (req, res) => {
    try {
      const { first_name, last_name, email, mobile_number } = req.body;
      const files = req.files;
      Users.findOne({ _id: req.user_id }, async function (err, result) {
        if (err || !result) {
          for (prop in err.errors) {
            var str = err.errors[prop].message;
            return res.status(422).json(responseData(str, {}, 422));
          }
        } else {
          var user = {};
          user.first_name = first_name;
          user.last_name = last_name;
          user.email = email;
          user.mobile_number = mobile_number;
          if (files && files.image.name != undefined) {
            var profile = await saveFile(
              files.image,
              config.USER_IMAGE,
              result.old_image
            );
            await saveThumbFile(
              files.image,
              config.USER_IMAGE,
              result.old_image,
              profile,
              config.USER_HEIGHT,
              config.USER_WIDTH,
              config.USER_THUMB
            );
            user.image = profile;
            user.old_image = profile;
          }
          await Users.findOneAndUpdate(
            { _id: req.user_id },
            user,
            (err, result) => {
              if (err) {
                for (prop in err.errors) {
                  var str = err.errors[prop].message;
                  return res.status(422).json(responseData(str, {}, 422));
                }
              }
            }
          );

          const select = {
            first_name: 1,
            password: 1,
            status: 1,
            last_name: 1,
            email: 1,
            mobile_number: 1,
            api_token: 1,
            last_login_at: 1,
            image: 1,
          };
          Users.findOne(
            { _id: req.user_id },
            select,
            async function (err, result) {
              if (err || !result) {
                return res
                  .status(422)
                  .json(responseData("DATA_NOT_FOUND", {}, 422));
              } else {
                return res.json(responseData("PROFILE_UPDATE", result));
              }
            }
          );
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  dashboard: async (req, res) => {
    try {
      const userCount = await Users.countDocuments({}).exec();
      const auditorCount = await Users.countDocuments({ role_id: 4 }).exec();
      const companyCount = await Users.countDocuments({ role_id: 3 }).exec();
      const totalAudit = await Audits.countDocuments().exec();
      const completedAuditCount = await Audits.countDocuments({
        status: { $in: ["COMPLETED", "AU_GOVERNMENT"] },
      }).exec();
      return res.json(
        responseData("DATA_RECEIVED", {
          user: userCount,
          totalClient: companyCount,
          totalAuditor: auditorCount,
          createdAudit: totalAudit,
          completedAudit: completedAuditCount,
          processAudit: completedAuditCount,
        })
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateProfileCompany: async (req, res) => {
    try {
      const {
        abn_number,
        address,
        address_line,
        city,
        first_name,
        last_name,
        mobile_number,
        landline_number,
        postcode,
      } = req.body;
      const files = req.files;
      Users.findOne({ _id: req.user_id }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          var user = {};
          user.abn_number = abn_number;
          user.address = address;
          user.address_line = address_line;
          user.city = city;
          user.first_name = first_name;
          user.last_name = last_name;
          user.mobile_number = mobile_number;
          user.landline_number = landline_number;
          user.postcode = postcode;

          if (files && files.image.name != undefined) {
            var profile = await saveFile(
              files.image,
              config.USER_IMAGE,
              result.old_image
            );
            await saveThumbFile(
              files.image,
              config.USER_IMAGE,
              result.old_image,
              profile,
              config.USER_HEIGHT,
              config.USER_WIDTH,
              config.USER_THUMB
            );
            user.image = profile;
            user.old_image = profile;
          }
          await Users.findOneAndUpdate(
            { _id: req.user_id },
            user,
            (err, result) => {
              if (err) {
                for (prop in err.errors) {
                  var str = err.errors[prop].message;
                  return res.status(422).json(responseData(str, {}, 422));
                }
              }
            }
          );

          const select = {
            first_name: 1,
            password: 1,
            status: 1,
            last_name: 1,
            email: 1,
            mobile_number: 1,
            landline_number: 1,
            api_token: 1,
            last_login_at: 1,
            image: 1,
            abn_number: 1,
            address: 1,
            company_name: 1,
            address_line: 1,
            city: 1,
            postcode: 1,
            state: 1,
          };
          Users.findOne(
            { _id: req.user_id },
            select,
            async function (err, result) {
              if (err || !result) {
                return res
                  .status(422)
                  .json(responseData("DATA_NOT_FOUND", {}, 422));
              } else {
                return res.json(responseData("PROFILE_UPDATE", result));
              }
            }
          );
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateProfileAuditor: async (req, res) => {
    try {
      const { address, first_name, last_name, mobile_number } = req.body;
      const files = req.files;
      Users.findOne({ _id: req.user_id }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          var user = {};
          user.address = address;
          user.first_name = first_name;
          user.last_name = last_name;
          user.mobile_number = mobile_number;
          if (files && files.image.name != undefined) {
            var profile = await saveFile(
              files.image,
              config.USER_IMAGE,
              result.old_image
            );
            await saveThumbFile(
              files.image,
              config.USER_IMAGE,
              result.old_image,
              profile,
              config.USER_HEIGHT,
              config.USER_WIDTH,
              config.USER_THUMB
            );
            user.image = profile;
            user.old_image = profile;
          }
          await Users.findOneAndUpdate(
            { _id: req.user_id },
            user,
            (err, result) => {
              if (err) {
                for (prop in err.errors) {
                  var str = err.errors[prop].message;
                  return res.status(422).json(responseData(str, {}, 422));
                }
              }
            }
          );

          const select = {
            first_name: 1,
            password: 1,
            status: 1,
            last_name: 1,
            email: 1,
            mobile_number: 1,
            api_token: 1,
            last_login_at: 1,
            image: 1,
            address: 1,
          };
          Users.findOne(
            { _id: req.user_id },
            select,
            async function (err, result) {
              if (err || !result) {
                return res
                  .status(422)
                  .json(responseData("DATA_NOT_FOUND", {}, 422));
              } else {
                return res.json(responseData("PROFILE_UPDATE", result));
              }
            }
          );
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  getDashboard: async (req, res) => {
    try {
      var result = {};
      const user = await Users.findOne(
        { _id: req.user_id },
        { role_id: 1, _id: 1 }
      );
      if (user.role_id === 3) {
        data = await Audits.findOne(
          { company_id: user._id },
          {
            _id: 1,
            audit_number: 1,
            status_view: 1,
            created_at: 1,
            type: 1,
            is_request: 1,
            is_advance: 1,
            is_final: 1,
            sla_document: 1,
            documentComplete: 1,
            required_additional_doc: 1,
            title: 1,
          },
          {
            sort: { _id: -1 },
          }
        ).lean();

        if (data)
          if (data.type === "VERIFICATION") {
            const auditLog = await AuditLog.find(
              { audit_id: data._id },
              { status: 1, created_at: 1 }
            ).lean();

            var currentDate = moment(data.created_at);
            var futureMonth = moment(currentDate).add(4, "M");

            result.id = data._id;
            result.type = data.type;
            result.typeView = "Verification";
            result.sla_document = data.sla_document;
            result.is_advance = data.is_advance;
            result.is_final = data.is_final;
            result.is_request = data.is_request;
            result.audit_number = data.title;
            result.chat_audit_number = data.audit_number;
            result.required_additional_doc = data.required_additional_doc;
            result.status = data.status_view;
            result.current = config.AUDIT_STATUS_ARRAY[data.status_view];
            result.next_step = config.AUDIT_NEXT_STEP[data.status_view];
            result.date = futureMonth.format("DD MMMM YYYY");
            result.audit_process = [];
            var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            numbers.forEach(function (key) {
              var obj = {};
              var item = {};
              if (key === 0) {
                obj.title = `Audit created `;

                obj.log = item;
              } else {
                obj.title = config.VERIFICATION_STATUS_ARRAY[key];
                obj.log = item;
                item = auditLog.find(
                  (opt) => opt.status === config.VERIFICATION_STATUS_LOG[key]
                );
                if (item) {
                  if (item.status === "AU_GOVERNMENT") {
                    obj.date = moment(item.created_at).format("DD MMMM YYYY");
                  }
                  obj.log = item;
                }
              }
              result.audit_process.push(obj);
            });
          } else {
            const auditLog = await AuditLog.find(
              { audit_id: data._id },
              { status: 1, created_at: 1 }
            ).lean();

            var documentDate = moment().format("DD MMMM YYYY");
            var stageOne = moment().add(14, "days").format("DD MMMM YYYY");
            var stageTwo = moment().add(56, "days").format("DD MMMM YYYY");
            if (data.documentComplete) {
              documentDate = moment(data.documentComplete).format(
                "DD MMMM YYYY"
              );
              stageOne = moment(data.documentComplete)
                .add(14, "days")
                .format("DD MMMM YYYY");
              stageTwo = moment(data.documentComplete)
                .add(56, "days")
                .format("DD MMMM YYYY");
            }

            var currentDate = moment(data.created_at);
            var futureMonth = moment(currentDate).add(6, "M");

            result.id = data._id;
            result.type = data.type;
            result.typeView = "Certification";
            result.sla_document = data.sla_document;
            result.is_advance = data.is_advance;
            result.is_final = data.is_final;
            result.is_request = data.is_request;
            result.audit_number = data.title;
            result.chat_audit_number = data.audit_number;
            result.required_additional_doc = data.required_additional_doc;
            result.status = data.status_view;
            result.current = config.AUDIT_STATUS_ARRAY[data.status_view];
            result.next_step =
              config.AUDIT_NEXT_STEP_CERTIFICATION[data.status_view];
            result.date = futureMonth.format("DD MMMM YYYY");

            result.audit_process = [];
            var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            numbers.forEach(function (key) {
              var obj = {};
              var item = {};
              if (key === 0) {
                obj.title = `Audit created`;
                obj.log = item;
              } else {
                obj.title = config.CERTIFICATION_STATUS_ARRAY[key];
                if (key === 3) {
                  obj.date = documentDate;
                }
                if (key === 6) {
                  obj.date = stageOne;
                }
                if (key === 9) {
                  obj.date = stageTwo;
                }

                obj.log = item;
                item = auditLog.find(
                  (opt) => opt.status === config.CERTIFICATION_STATUS_LOG[key]
                );
                if (item) {
                  obj.log = item;
                  if (item.status === "AU_GOVERNMENT") {
                    obj.date = moment(item.created_at).format("DD MMMM YYYY");
                  }
                }
              }
              result.audit_process.push(obj);
            });
          }
      } else {
        const allAuditCount = await Audits.countDocuments({
          $or: [{ lead: user._id }, { peer: user._id }, { support: user._id }],
        }).exec();
        const completedAuditCount = await Audits.countDocuments({
          $or: [{ lead: user._id }, { peer: user._id }, { support: user._id }],
          status: { $in: ["COMPLETED", "AU_GOVERNMENT"] },
        }).exec();
        result.allAuditCount = allAuditCount;
        result.completedAuditCount = completedAuditCount;
        result.progressAuditCount = allAuditCount - completedAuditCount;
      }
      return res.json(responseData("DATA_RECEIVED", result));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
};
