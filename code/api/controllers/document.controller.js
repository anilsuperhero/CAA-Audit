var document_service = require("../services/document/document.services");
const { responseData } = require("../helpers/responseData");

module.exports = {
  /**
   * Update key staff for audit request
   *
   * @method get
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  updateStaff: async (req, res) => {
    try {
      await document_service.updateStaff(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Update primary document
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  updatePrimaryDocument: async (req, res) => {
    try {
      await document_service.updatePrimaryDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Get Primary Document
   *
   * @method get
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  getPrimaryDocument: async (req, res) => {
    try {
      await document_service.getPrimaryDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Update secondary document
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  updateSecondaryDocument: async (req, res) => {
    try {
      await document_service.updateSecondaryDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Get Primary Document
   *
   * @method get
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  getSecondaryDocument: async (req, res) => {
    try {
      await document_service.getSecondaryDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Update document
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  updateDocument: async (req, res) => {
    try {
      await document_service.updateDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Delete document
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  deleteDocument: async (req, res) => {
    try {
      await document_service.deleteDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Delete document
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  updateDocumentStatus: async (req, res) => {
    try {
      await document_service.updateDocumentStatus(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Update primary document
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  singleDocument: async (req, res) => {
    try {
      await document_service.singleDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Submit Request
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  submitRequest: async (req, res) => {
    try {
      await document_service.submitRequest(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Update primary document
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  multiDocument: async (req, res) => {
    try {
      await document_service.multiDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Create zip folder
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  downloadDocument: async (req, res) => {
    try {
      await document_service.downloadDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Create zip folder
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  downloadSecondaryDocument: async (req, res) => {
    try {
      await document_service.downloadSecondaryDocument(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Download zip
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  downloadZip: async (req, res) => {
    try {
      await document_service.downloadZip(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
  /**
   * Get report reject
   *
   * @method post
   *
   * @param {*} req
   * @param {*} res
   * @returns
   *
   */
  rejectionReasons: async (req, res) => {
    try {
      await document_service.rejectionReasons(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
};
