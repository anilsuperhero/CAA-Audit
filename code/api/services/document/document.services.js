const Audits = require("../../models/Audits");
const AuditDocument = require("../../models/auditDocument");
const Users = require("../../models/User");
const KeyPersonal = require("../../models/keyPersonal");
const AuditLog = require("../../models/AuditLog");
const ReportLog = require("../../models/ReportLog");
const { responseData } = require("../../helpers/responseData");
const Promise = require("bluebird");
const AdmZip = require("adm-zip");
var path = require("path");
const fs = require("fs");
const {
  saveFile,
  documentPath,
  removeFile,
  sendNotification,
  copyImage,
} = require("../../helpers/helpers");
const config = require("../../config/config");

module.exports = {
  updateStaff: async (req, res) => {
    try {
      let { slug } = req.query;
      Audits.findOne(
        { _id: slug },
        {
          _id: 1,
          company_id: 1,
          selectedDocument: 1,
          keyStaff: 1,
          type: 1,
        },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          } else {
            if (result.type === "VERIFICATION") {
              const keyStaff = await KeyPersonal.find({
                company_id: result.company_id,
              })
                .sort({ first_name: 1 })
                .select({
                  _id: 1,
                  first_name: 1,
                  last_name: 1,
                  email: 1,
                  positionHeld: 1,
                  status: 1,
                  audit_number: 1,
                })
                .lean();

              const staffDoc = [];
              for (var i = 0; i < keyStaff.length; i++) {
                var item = keyStaff[i];
                item.document = [];
                staffDoc.push(item);
              }

              await Promise.map(result.selectedDocument, async (item) => {
                if (item.documents.staff.length > 0) {
                  item.documents.staff = await Promise.map(
                    staffDoc,
                    async (staff) => {
                      var staffDocument = {};
                      staffDocument._id = staff._id;
                      staffDocument.first_name = staff.first_name;
                      staffDocument.last_name = staff.last_name;
                      staffDocument.email = staff.email;
                      staffDocument.status = staff.status;
                      staffDocument.positionHeld = staff.positionHeld;
                      staffDocument.document = item.documents.staff;
                      return staffDocument;
                    }
                  );
                }

                return item;
              });

              const request = {};
              request.keyStaff = keyStaff;
              request.selectedDocument = result.selectedDocument;
              request.status = "KEP_UPDATE";
              request.status_view = "KEP_UPDATE";
              var documentCount = 0;
              await result.selectedDocument.forEach(async (document, index) => {
                if (document.documents.company.length > 0) {
                  documentCount += document.documents.company.length;
                }
                if (document.documents.staff.length > 0) {
                  await document.documents.staff.forEach((staffEl, index) => {
                    if (staffEl.document && staffEl.document.length > 0) {
                      documentCount += staffEl.document.length;
                    }
                  });
                }
              });
              request.total_document = documentCount;

              /**
               * Save log
               */
              var auditLog = new AuditLog();
              auditLog.audit_id = result._id;
              auditLog.audit_number = result.audit_number;
              auditLog.company_id = result.company_id;
              auditLog.type = result.type.toUpperCase();
              auditLog.status = "KEP_UPDATE";
              auditLog.save();

              const reminderInfo = {};
              reminderInfo.lastReminderDate = "";
              reminderInfo.nextReminderDate = "";
              reminderInfo.reminderCount = 0;
              request.reminderInfo = reminderInfo;

              await Audits.updateOne(
                { _id: slug },
                request,
                (err, resultData) => {
                  if (err) {
                    for (prop in err.errors) {
                      var str = err.errors[prop].message;
                      return res.status(422).json(responseData(str, {}, 422));
                    }
                  } else {
                    return res.json(responseData("PROFILE_UPDATE", result));
                  }
                }
              );
            }
            if (result.type === "CERTIFICATION") {
              let { slug } = req.query;
              Audits.findOne(
                { _id: slug },
                {
                  _id: 1,
                  type: 1,
                  company_id: 1,
                  selectedDocument: 1,
                },
                async function (err, result) {
                  if (err || !result) {
                    return res
                      .status(422)
                      .json(responseData("DATA_NOT_FOUND", {}, 422));
                  } else {
                    const request = {};
                    var documentCount = 0;
                    result.selectedDocument.forEach((document) => {
                      if (document.documents.company.length > 0) {
                        documentCount += document.documents.company.length;
                      }
                    });
                    request.total_document = documentCount;

                    const reminderInfo = {};
                    reminderInfo.lastReminderDate = "";
                    reminderInfo.nextReminderDate = "";
                    reminderInfo.reminderCount = 0;
                    request.reminderInfo = reminderInfo;

                    await Audits.updateOne(
                      { _id: slug },
                      request,
                      async (err, resultData) => {
                        if (err) {
                          for (prop in err.errors) {
                            var str = err.errors[prop].message;
                            return res
                              .status(422)
                              .json(responseData(str, {}, 422));
                          }
                        } else {
                          let { slug } = req.query;

                          const reminderInfo = {};
                          reminderInfo.lastReminderDate = "";
                          reminderInfo.nextReminderDate = "";
                          reminderInfo.reminderCount = 0;

                          const count = await AuditDocument.countDocuments({
                            auditId: slug,
                            status: { $in: [2, 6] },
                          }).exec();
                          await Audits.updateOne(
                            { _id: slug },
                            {
                              uploaded_document: count,
                              isCertification: true,
                              reminderInfo: reminderInfo,
                            }
                          );
                          const auditRequest = await Audits.findOne({
                            _id: slug,
                          })
                            .populate(
                              "company_id",
                              "abn_number company_name _id"
                            )
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
                            })
                            .lean();
                          return res.json(
                            responseData("DATA_RECEIVED", auditRequest)
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        }
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updatePrimaryDocument: async (req, res) => {
    try {
      const request = req.body;
      const files = req.files;

      Audits.findOne(
        { _id: request.audit_id },
        { _id: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          }
        }
      );

      KeyPersonal.findOne(
        { _id: request.staff_id },
        { _id: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          }
        }
      );
      AuditDocument.findOne({ _id: request.id }, async function (err, result) {
        if (err || !result) {
          var document = new AuditDocument();
          document.companyId = req.user_id;
          document.auditId = request.audit_id;
          if (!request.applicable) {
            document.documentId = request.document_id;
            document.document_name = request.document_name;
          }
          document.staffId = request.staff_id;
          document.description = request.description;
          if (files && files.document.name != undefined) {
            var file = await saveFile(
              files.document,
              config.AUDIT_DOCUMENT,
              null
            );
            document.document_image_name = files.document.name;
            document.document = file;
          }
          if (request.applicable) {
            document.applicable = 2;
            document.remarks = request.remarks;
            document.description = request.remarks;
          }
          document.type = request.type;
          document.status = request.status;
          document.save();
        } else {
          var updateObj = {};
          if (files && files.document.name != undefined) {
            var file = await saveFile(
              files.document,
              config.AUDIT_DOCUMENT,
              result.document
            );
            updateObj.document = file;
            updateObj.document_image_name = files.document.name;
          }
          updateObj.description = request.description;
          updateObj.status = request.status;
          await AuditDocument.updateOne({ _id: result._id }, updateObj);
        }
      });
      Audits.findOne(
        { _id: request.audit_id },
        { key_primaryDocument: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          } else {
            const primaryDocument = [];
            await Promise.map(result.key_primaryDocument, async (item) => {
              if (item._id == request.staff_id) {
                item.status = parseInt(request.status);
                if (!request.applicable) {
                  item.documentId = request.document_id;
                }
              }
              return item;
            });

            const requestUpdate = {};
            requestUpdate.key_primaryDocument = result.key_primaryDocument;

            const reminderInfo = {};
            reminderInfo.lastReminderDate = "";
            reminderInfo.nextReminderDate = "";
            reminderInfo.reminderCount = 0;
            requestUpdate.reminderInfo = reminderInfo;

            await Audits.updateOne(
              { _id: request.audit_id },
              requestUpdate,
              (err, resultData) => {
                if (err) {
                  for (prop in err.errors) {
                    var str = err.errors[prop].message;
                    return res.status(422).json(responseData(str, {}, 422));
                  }
                } else {
                  return res.json(
                    responseData("DOCUMENT_UPDATE_UPLOAD", {
                      slug: request.audit_id,
                    })
                  );
                }
              }
            );
          }
        }
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  getPrimaryDocument: async (req, res) => {
    try {
      const request = req.body;
      const requestQuery = {};
      if (request.type === "PRIMARY") {
        requestQuery.auditId = request.auditId;
        requestQuery.staffId = request.userId;
        requestQuery.documentId = request.documentId;
        requestQuery.type = request.type;
      }
      if (request.type === "SINGLE") {
        requestQuery.auditId = request.auditId;
        requestQuery.documentId = request.documentId;
        requestQuery.registrationId = request.registration_id;
        requestQuery.type = request.type;
      }
      if (request.type === "SINGLE-STAFF") {
        requestQuery.auditId = request.auditId;
        requestQuery.documentId = request.documentId;
        requestQuery.registrationId = request.registration_id;
        requestQuery.staffId = request.userId;
        requestQuery.type = request.type;
      }
      const data = await AuditDocument.findOne(requestQuery, {
        _id: 1,
        auditId: 1,
        document: 1,
        document_name: 1,
        document_image_name: 1,
        description: 1,
        remarks: 1,
        documentId: 1,
        type: 1,
        status: 1,
      })
        .sort({ _id: -1 })
        .lean();
      data.documentUrl = await documentPath(
        config.AUDIT_DOCUMENT + data.auditId,
        data.document
      );
      return res.json(responseData("DOCUMENT_UPDATE_UPLOAD", data));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateSecondaryDocument: async (req, res) => {
    try {
      const request = req.body;
      const files = req.files;

      Audits.findOne(
        { _id: request.audit_id },
        { _id: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          }
        }
      );

      KeyPersonal.findOne(
        { _id: request.staff_id },
        { _id: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          }
        }
      );

      if (request.status == 6) {
        var document = new AuditDocument();
        document.companyId = req.user_id;
        document.auditId = request.audit_id;
        document.staffId = request.staff_id;
        document.description = request.description;
        document.remarks = request.remarks;
        document.type = request.type;
        document.status = request.status;
        document.save();
        return res.json(responseData("DOCUMENT_UPDATE_UPLOAD"));
      } else {
        AuditDocument.findOne(
          {
            auditId: request.audit_id,
            documentId: request.document_id,
            staffId: request.staff_id,
          },
          async function (err, result) {
            if (err || result) {
              return res
                .status(422)
                .json(responseData("UPLOAD_THIS_DOCUMENT", {}, 422));
            } else {
              var document = new AuditDocument();
              document.companyId = req.user_id;
              document.auditId = request.audit_id;
              document.documentId = request.document_id;
              document.document_name = request.document_name;
              document.staffId = request.staff_id;
              if (files && files.document.name != undefined) {
                var file = await saveFile(
                  files.document,
                  config.AUDIT_DOCUMENT,
                  null
                );
                document.document = file;
                document.document_image_name = files.document.name;
              }
              document.description = request.description;
              document.type = request.type;
              document.status = request.status;
              document.save();
              return res.json(responseData("DOCUMENT_UPDATE_UPLOAD"));
            }
          }
        );
      }
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  getSecondaryDocument: async (req, res) => {
    try {
      const request = req.body;
      const requestQuery = {};
      if (request.type === "SECONDARY") {
        requestQuery.auditId = request.audit_id;
        requestQuery.staffId = request.staff_id;
        requestQuery.type = request.type;
      }
      if (request.type === "COMPANY-MULTI") {
        requestQuery.auditId = request.audit_id;
        requestQuery.documentId = request.document_id;
        requestQuery.registrationId = request.registration_id;
        requestQuery.type = request.type;
      }
      if (request.type === "STAFF-MULTI") {
        requestQuery.auditId = request.audit_id;
        requestQuery.documentId = request.document_id;
        requestQuery.registrationId = request.registration_id;
        requestQuery.staffId = request.staff_id;
        requestQuery.type = request.type;
      }
      const data = await AuditDocument.find(requestQuery, {
        _id: 1,
        document: 1,
        auditId: 1,
        documentId: 1,
        document_name: 1,
        description: 1,
        remarks: 1,
        type: 1,
        status: 1,
        document_image_name: 1,
      })
        .sort({ _id: -1 })
        .lean();
      await Promise.map(data, async (item) => {
        item.documentUrl = await documentPath(
          config.AUDIT_DOCUMENT + item.auditId,
          item.document
        );
        return item;
      });
      return res.json(responseData("DOCUMENT_UPDATE_UPLOAD", data));
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateDocument: async (req, res) => {
    try {
      const request = req.body;
      const files = req.files;

      AuditDocument.findOne({ _id: request.id }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          var updateObj = {};
          if (files && files.document.name != undefined) {
            var file = await saveFile(
              files.document,
              config.AUDIT_DOCUMENT,
              result.document
            );
            updateObj.document = file;
          }
          updateObj.description = request.description;
          updateObj.document_image_name = files.document.name;
          await AuditDocument.updateOne({ _id: result._id }, updateObj);
          return res.json(responseData("DOCUMENT_UPDATE_UPLOAD"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  deleteDocument: async (req, res) => {
    try {
      const { id } = req.body;
      AuditDocument.findOne({ _id: id }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          await removeFile(config.AUDIT_DOCUMENT, result.document);
          await AuditDocument.remove({ _id: id }, (err, result) => {
            return res.json(responseData("DOCUMENT_DELETE"));
          });
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateDocumentStatus: async (req, res) => {
    try {
      const request = req.body;
      const requestUpdate = {};

      Audits.findOne(
        { _id: request.auditId },
        {
          key_primaryDocument: 1,
          selectedDocument: 1,
          key_secondaryDocument: 1,
        },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          } else {
            if (request.type === "SECONDARY") {
              await AuditDocument.updateOne(
                {
                  auditId: request.auditId,
                  staffId: request.staff_id,
                  type: request.type,
                },
                { status: parseInt(request.status) }
              );
              await Promise.map(result.key_secondaryDocument, async (item) => {
                if (item._id == request.staff_id) {
                  item.status = parseInt(request.status);
                }
                return item;
              });
              requestUpdate.key_secondaryDocument =
                result.key_secondaryDocument;
              if (request.remarks) {
                requestUpdate.remarks = request.remarks;
              }
            }
            if (request.type === "COMPANY-MULTI") {
              await AuditDocument.updateOne(
                {
                  auditId: request.auditId,
                  documentId: request.document_id,
                  registrationId: request.registration_id,
                  type: request.type,
                },
                { status: parseInt(request.status) }
              );
              await Promise.map(result.selectedDocument, async (item) => {
                if (item.id === request.registration_id) {
                  var document = item.documents.company;
                  item.documents.company = await Promise.map(
                    document,
                    async (companyDoc) => {
                      if (companyDoc.id === request.document_id) {
                        companyDoc.status = parseInt(request.status);
                      }
                      return companyDoc;
                    }
                  );
                }
                return item;
              });
              requestUpdate.selectedDocument = result.selectedDocument;
              if (request.remarks) {
                requestUpdate.remarks = request.remarks;
              }
            }
            if (request.type === "STAFF-MULTI") {
              await AuditDocument.updateOne(
                {
                  auditId: request.auditId,
                  documentId: request.document_id,
                  registrationId: request.registration_id,
                  staffId: request.staff_id,
                  type: request.type,
                },
                { status: parseInt(request.status) }
              );
              await Promise.map(result.selectedDocument, async (item) => {
                if (item.id === request.registration_id) {
                  var staff = item.documents.staff;
                  item.documents.staff = await Promise.map(
                    staff,
                    async (staffDoc) => {
                      if (staffDoc._id == request.staff_id) {
                        staffDoc.document = await Promise.map(
                          staffDoc.document,
                          async (companyDoc) => {
                            if (companyDoc.id === request.document_id) {
                              companyDoc.status = parseInt(request.status);
                            }
                            return companyDoc;
                          }
                        );
                      }
                      return staffDoc;
                    }
                  );
                }
                return item;
              });
              requestUpdate.selectedDocument = result.selectedDocument;
              if (request.remarks) {
                requestUpdate.remarks = request.remarks;
              }
            }

            const reminderInfo = {};
            reminderInfo.lastReminderDate = "";
            reminderInfo.nextReminderDate = "";
            reminderInfo.reminderCount = 0;
            requestUpdate.reminderInfo = reminderInfo;

            await Audits.updateOne(
              { _id: request.auditId },
              requestUpdate,
              (err, resultData) => {
                if (err) {
                  for (prop in err.errors) {
                    var str = err.errors[prop].message;
                    return res.status(422).json(responseData(str, {}, 422));
                  }
                } else {
                  return res.json(
                    responseData("DOCUMENT_UPDATE_UPLOAD", {
                      slug: request.auditId,
                    })
                  );
                }
              }
            );
          }
        }
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  singleDocument: async (req, res) => {
    try {
      const request = req.body;
      const files = req.files;
      Audits.findOne(
        { _id: request.audit_id },
        { _id: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          }
        }
      );

      AuditDocument.findOne({ _id: request.id }, async function (err, result) {
        if (err || !result) {
          var document = new AuditDocument();
          if (
            request.type === "SINGLE-STAFF" ||
            request.type === "STAFF-MULTI"
          ) {
            document.staffId = request.staff_id;
          }
          document.companyId = req.user_id;
          document.auditId = request.audit_id;
          document.documentId = request.document_id;
          document.document_name = request.document_name;
          document.registrationId = request.registration_id;
          if (files && files.document.name != undefined) {
            var file = await saveFile(
              files.document,
              config.AUDIT_DOCUMENT + request.audit_id,
              null
            );
            document.document = file;
            document.document_image_name = files.document.name;
          }
          if (request.applicable) {
            document.applicable = 2;
            document.remarks = request.remarks;
          }
          document.description = request.description;
          document.type = request.type;
          document.status = request.status;
          document.save();
        } else {
          var updateObj = {};
          if (files && files.document.name != undefined) {
            var file = await saveFile(
              files.document,
              config.AUDIT_DOCUMENT + request.audit_id,
              result.document
            );
            updateObj.document = file;
            updateObj.document_image_name = files.document.name;
          }
          updateObj.description = request.description;
          updateObj.status = request.status;
          await AuditDocument.updateOne({ _id: result._id }, updateObj);
        }
      });
      if (request.type === "SINGLE") {
        Audits.findOne(
          { _id: request.audit_id },
          { selectedDocument: 1 },
          async function (err, result) {
            if (err || !result) {
              return res
                .status(422)
                .json(responseData("DATA_NOT_FOUND", {}, 422));
            } else {
              await Promise.map(result.selectedDocument, async (item) => {
                if (item.id === request.registration_id) {
                  var document = item.documents.company;
                  item.documents.company = await Promise.map(
                    document,
                    async (companyDoc) => {
                      if (companyDoc.id === request.document_id) {
                        companyDoc.status = parseInt(request.status);
                      }
                      return companyDoc;
                    }
                  );
                }
                return item;
              });

              const requestUpdate = {};
              requestUpdate.selectedDocument = result.selectedDocument;

              const reminderInfo = {};
              reminderInfo.lastReminderDate = "";
              reminderInfo.nextReminderDate = "";
              reminderInfo.reminderCount = 0;
              requestUpdate.reminderInfo = reminderInfo;

              await Audits.updateOne(
                { _id: request.audit_id },
                requestUpdate,
                (err, resultData) => {
                  if (err) {
                    for (prop in err.errors) {
                      var str = err.errors[prop].message;
                      return res.status(422).json(responseData(str, {}, 422));
                    }
                  } else {
                    return res.json(
                      responseData("DOCUMENT_UPDATE_UPLOAD", {
                        slug: request.audit_id,
                      })
                    );
                  }
                }
              );
            }
          }
        );
      } else if (request.type === "SINGLE-STAFF") {
        Audits.findOne(
          { _id: request.audit_id },
          { selectedDocument: 1 },
          async function (err, result) {
            if (err || !result) {
              return res
                .status(422)
                .json(responseData("DATA_NOT_FOUND", {}, 422));
            } else {
              await Promise.map(result.selectedDocument, async (item) => {
                if (item.id === request.registration_id) {
                  var staff = item.documents.staff;
                  item.documents.staff = await Promise.map(
                    staff,
                    async (staffDoc) => {
                      if (staffDoc._id == request.staff_id) {
                        staffDoc.document = await Promise.map(
                          staffDoc.document,
                          async (companyDoc) => {
                            if (companyDoc.id === request.document_id) {
                              companyDoc.status = parseInt(request.status);
                            }
                            return companyDoc;
                          }
                        );
                      }
                      return staffDoc;
                    }
                  );
                }
                return item;
              });

              const requestUpdate = {};
              requestUpdate.selectedDocument = result.selectedDocument;

              const reminderInfo = {};
              reminderInfo.lastReminderDate = "";
              reminderInfo.nextReminderDate = "";
              reminderInfo.reminderCount = 0;
              requestUpdate.reminderInfo = reminderInfo;

              await Audits.updateOne(
                { _id: request.audit_id },
                requestUpdate,
                (err, resultData) => {
                  if (err) {
                    for (prop in err.errors) {
                      var str = err.errors[prop].message;
                      return res.status(422).json(responseData(str, {}, 422));
                    }
                  } else {
                    return res.json(
                      responseData("DOCUMENT_UPDATE_UPLOAD", {
                        slug: request.audit_id,
                      })
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        return res.json(
          responseData("DOCUMENT_UPDATE_UPLOAD", {
            slug: request.audit_id,
          })
        );
      }
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  submitRequest: async (req, res) => {
    try {
      const { auditId, description, auditDate } = req.body;
      const auditsData = await Audits.findOne(
        { _id: auditId },
        { _id: 1, audit_number: 1, company_id: 1, type: 1, title: 1 },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          } else {
            /**
             * Send notification to user
             */

            var users = await Users.findOne({ _id: result.company_id });
            var message =
              "Request Audit Date submitted successfully for audit request reference number is #" +
              result.title;

            var notification = {};
            notification.user = users;
            notification.message = message;
            notification.action =
              "/audit-request?type=viewSla&audit_id=" + result._id;
            notification.title = "Audit Request";
            notification.isMail = true;
            sendNotification(notification);
          }
        }
      );
      const requestUpdate = {};
      requestUpdate.is_request = 1;
      requestUpdate.audit_date = auditDate;
      requestUpdate.description = description;
      requestUpdate.status = "REQUEST_AUDIT";
      requestUpdate.status_view = "REQUEST_AUDIT";

      const reminderInfo = {};
      reminderInfo.lastReminderDate = "";
      reminderInfo.nextReminderDate = "";
      reminderInfo.reminderCount = 0;
      requestUpdate.reminderInfo = reminderInfo;

      await Audits.updateOne(
        { _id: auditId },
        requestUpdate,
        async (err, resultData) => {
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
            auditLog.audit_id = auditId;
            auditLog.audit_number = auditsData.audit_number;
            auditLog.company_id = auditsData.company_id;
            auditLog.type = auditsData.type.toUpperCase();
            auditLog.status = "REQUEST_AUDIT";
            auditLog.save();

            /**
             * Send Email to admin
             */
            var admin = await Users.findOne({ role_id: 1 });
            var company = await Users.findOne({ _id: auditsData.company_id });
            var message =
              company.company_name +
              " has been uploaded document and sent audit date request for audit request reference number " +
              auditsData.title;

            var notification = {};
            notification.user = admin;
            notification.message = message;
            notification.action = "admin/audit-request";
            notification.title = "Document Submitted";
            notification.isMail = true;
            sendNotification(notification);

            return res.json(
              responseData("DOCUMENT_UPDATE_UPLOAD", { slug: auditId })
            );
          }
        }
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  multiDocument: async (req, res) => {
    try {
      const request = req.body;
      const files = req.files;
      const requestUpdate = {};

      AuditDocument.findOne({ _id: request.id }, async function (err, result) {
        if (err || !result) {
          var document = new AuditDocument();
          if (request.type === "STAFF-MULTI") {
            document.staffId = request.staff_id;
          }
          document.companyId = req.user_id;
          document.auditId = request.audit_id;
          document.documentId = request.document_id;
          document.document_name = request.document_name;
          document.registrationId = request.registration_id;
          if (files && files.document.name != undefined) {
            var file = await saveFile(
              files.document,
              config.AUDIT_DOCUMENT,
              null
            );
            document.document = file;
            document.document_image_name = files.document.name;
          }
          if (request.applicable) {
            document.applicable = 2;
            document.remarks = request.remarks;
          }
          document.description = request.description;
          document.type = request.type;
          document.status = request.status;
          document.save();

          Audits.findOne(
            { _id: request.audit_id },
            {
              key_primaryDocument: 1,
              selectedDocument: 1,
              key_secondaryDocument: 1,
            },
            async function (err, result) {
              if (err || !result) {
                return res
                  .status(422)
                  .json(responseData("DATA_NOT_FOUND", {}, 422));
              } else {
                if (request.type === "STAFF-MULTI") {
                  console.log("i am here");
                  await AuditDocument.updateOne(
                    {
                      auditId: request.audit_id,
                      documentId: request.document_id,
                      registrationId: request.registration_id,
                      staffId: request.staff_id,
                      type: request.type,
                    },
                    { status: parseInt(6) }
                  );
                  await Promise.map(result.selectedDocument, async (item) => {
                    if (item.id === request.registration_id) {
                      var staff = item.documents.staff;
                      item.documents.staff = await Promise.map(
                        staff,
                        async (staffDoc) => {
                          if (staffDoc._id == request.staff_id) {
                            staffDoc.document = await Promise.map(
                              staffDoc.document,
                              async (companyDoc) => {
                                if (companyDoc.id === request.document_id) {
                                  companyDoc.status = parseInt(6);
                                }
                                return companyDoc;
                              }
                            );
                          }
                          return staffDoc;
                        }
                      );
                    }
                    return item;
                  });
                  requestUpdate.selectedDocument = result.selectedDocument;
                  if (request.remarks) {
                    requestUpdate.remarks = request.remarks;
                  }
                }

                const reminderInfo = {};
                reminderInfo.lastReminderDate = "";
                reminderInfo.nextReminderDate = "";
                reminderInfo.reminderCount = 0;
                requestUpdate.reminderInfo = reminderInfo;

                await Audits.updateOne(
                  { _id: request.audit_id },
                  requestUpdate,
                  (err, resultData) => {
                    if (err) {
                      for (prop in err.errors) {
                        var str = err.errors[prop].message;
                        return res.status(422).json(responseData(str, {}, 422));
                      }
                    } else {
                      return res.json(
                        responseData("DOCUMENT_UPDATE_UPLOAD", {
                          slug: request.audit_id,
                        })
                      );
                    }
                  }
                );
              }
            }
          );
        } else {
          var updateObj = {};
          if (files && files.document.name != undefined) {
            var file = await saveFile(
              files.document,
              config.AUDIT_DOCUMENT,
              result.document
            );
            updateObj.document = file;
            updateObj.document_image_name = files.document.name;
          }
          updateObj.description = request.description;
          updateObj.status = request.status;
          await AuditDocument.updateOne({ _id: result._id }, updateObj);
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  downloadDocument: async (req, res) => {
    try {
      const request = req.body;
      const requestQuery = {};
      requestQuery.auditId = request.audit_id;
      requestQuery.documentId = request.document_id;
      requestQuery.registrationId = request.registration_id;
      requestQuery.staffId = request.staff_id;
      requestQuery.type = request.type;
      var folder = Date.now();
      var folderName = `${config.DOWNLOAD_DOCUMENT}${folder}/`;
      AuditDocument.find(requestQuery, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          await Promise.map(result, async (item) => {
            var document = await documentPath(
              config.AUDIT_DOCUMENT + item.auditId,
              item.document
            );
            await copyImage(document, folderName, item.document);
            return item;
          });
        }
        return res.json(
          responseData("DOCUMENT_UPDATE_UPLOAD", { folderName: folder })
        );
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  downloadSecondaryDocument: async (req, res) => {
    try {
      const request = req.body;
      const requestQuery = {};
      requestQuery.auditId = request.audit_id;
      requestQuery.documentId = request.document_id;
      requestQuery.registrationId = request.registration_id;
      requestQuery.type = request.type;

      var folder = Date.now();
      var folderName = `${config.DOWNLOAD_DOCUMENT}${folder}/`;
      AuditDocument.find(requestQuery, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          await Promise.map(result, async (item) => {
            var document = await documentPath(
              config.AUDIT_DOCUMENT + item.auditId,
              item.document
            );
            await copyImage(document, folderName, item.document);
            return item;
          });
        }
        return res.json(
          responseData("DOCUMENT_UPDATE_UPLOAD", { folderName: folder })
        );
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  downloadZip: async (req, res) => {
    try {
      const { folderName } = req.body;
      var newPath = path.join(__dirname, "../../public/download-document");
      var uploadDir = fs.readdirSync(newPath + `/${folderName}`);
      const zip = new AdmZip();
      for (var i = 0; i < uploadDir.length; i++) {
        await zip.addLocalFile(newPath + `/${folderName}/` + uploadDir[i]);
      }

      const downloadName = `${Date.now()}.zip`;
      await zip.writeZip(newPath + "/" + downloadName);
      var url = await documentPath(config.DOWNLOAD_DOCUMENT, downloadName);
      return res.json(
        responseData("DOCUMENT_UPDATE_UPLOAD", {
          fileName: downloadName,
          url: url,
        })
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  rejectionReasons: async (req, res) => {
    try {
      const { auditId } = req.query;
      ReportLog.find(
        { audit_id: auditId, status: "REJECT" },
        {
          _id: 1,
          report_remarks: 1,
          audit_number: 1,
          created_at: 1,
        },
        async function (err, result) {
          if (err || !result) {
            return res
              .status(422)
              .json(responseData("DATA_NOT_FOUND", {}, 422));
          } else {
            return res.json(responseData("DATA_RECEIVED", result));
          }
        }
      );
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
};
