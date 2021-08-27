const { responseData } = require("../helpers/responseData");
var service = require("../services/audits/audits.services");

module.exports = {
  /**
   * @method get
   * @param {*} req
   * @param {*} res
   * @returns
   */
  Index: async (req, res) => {
    try {
      await service.index(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @method post
   *
   * {"id":"","title":"test","type":"company","extension":[".pdf",".jpg"]}
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  Create: async (req, res) => {
    try {
      await service.create(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @method post
   *
   * {lead: "60abdb2176697a094af1ccd1", support: "", peer: "609283c034bd1a52e459db12"}
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  Assign: async (req, res) => {
    try {
      await service.assign(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  Delete: async (req, res) => {
    try {
      await service.delete(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   * @method get
   * @param {*} req
   * @param {*} res
   * @returns
   */
  indexAdmin: async (req, res) => {
    try {
      await service.indexAdmin(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  slaUpload: async (req, res) => {
    try {
      await service.slaUpload(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  slaSignature: async (req, res) => {
    try {
      await service.slaSignature(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  docuSign: async (req, res) => {
    try {
      await service.docuSign(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  documentList: async (req, res) => {
    try {
      await service.documentList(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   * @method get
   * @param {*} req
   * @param {*} res
   * @returns
   */
  indexAuditor: async (req, res) => {
    try {
      await service.indexAuditor(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  updateRequest: async (req, res) => {
    try {
      await service.updateRequest(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  uploadReport: async (req, res) => {
    try {
      await service.uploadReport(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  uploadReportNew: async (req, res) => {
    try {
      await service.uploadReportNew(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  rejectReport: async (req, res) => {
    try {
      await service.rejectReport(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  acceptReport: async (req, res) => {
    try {
      await service.acceptReport(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  rejectReportStage: async (req, res) => {
    try {
      await service.rejectReportStage(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  documentRequest: async (req, res) => {
    try {
      await service.documentRequest(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  documentRequestCompany: async (req, res) => {
    try {
      await service.documentRequestCompany(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG!";
      return res.json(responseData(msg, {}, 201));
    }
  },
};
