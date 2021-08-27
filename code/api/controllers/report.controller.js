var report_service = require("../services/report/report.services");
const { responseData } = require("../helpers/responseData");

module.exports = {
  /**
   * Submit request for 2 stage
   *
   * @method post
   *
   * {"auditDate":"10-09-2021","description":"Test","auditId":"6110b890fde0bb44e838d152"}
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  submitRequest: async (req, res) => {
    try {
      await report_service.submitRequest(req, res);
    } catch (err) {
      var msg = err.message || "SOMETHING_WENT_WRONG";
      return res.status(422).json(responseData(msg, {}, 422));
    }
  },
};
