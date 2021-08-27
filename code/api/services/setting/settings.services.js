const Setting = require("../../models/Setting");
const { responseData } = require("../../helpers/responseData");

module.exports = {
  getSettings: async (req, res) => {
    try {
      const select = {
        email: 1,
        name: 1,
        sort_name: 1,
        support_email: 1,
        address: 1,
        number: 1,
        definition: 1,
        payment_terms: 1,
        copy_right: 1,
        email_header: 1,
        email_footer: 1,
        banck_information: 1,
        submit_request: 1,
        key_personnel: 1,
        chat_document: 1,
        audit_conformation: 1,
        signature_online: 1,
        signature_self: 1,
        not_started: 1,
        on_going: 1,
        completed: 1,
      };
      Setting.findOne({}, select, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          return res.json(responseData("DATA_RECEIVED", result));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  createSetting: async (req, res) => {
    try {
      Setting.findOne({}, async function (err, result) {
        if (err) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          const {
            email,
            name,
            sort_name,
            support_email,
            address,
            copy_right,
            number,
            definition,
            pickup_note,
            email_header,
            email_footer,
            payment_terms,
            banck_information,
            submit_request,
            key_personnel,
            chat_document,
            audit_conformation,
            signature_online,
            signature_self,
            not_started,
            on_going,
            completed,
          } = req.body;
          var setting = new Setting();
          setting.email = email;
          setting.sort_name = sort_name;
          setting.name = name;
          setting.support_email = support_email;
          setting.address = address;
          setting.number = number;
          setting.copy_right = copy_right;
          setting.definition = definition;
          setting.pickup_note = pickup_note;
          setting.email_header = email_header;
          setting.email_footer = email_footer;
          setting.payment_terms = payment_terms;
          setting.banck_information = banck_information;
          setting.submit_request = submit_request;
          setting.key_personnel = key_personnel;
          setting.chat_document = chat_document;
          setting.audit_conformation = audit_conformation;
          setting.signature_online = signature_online;
          setting.signature_self = signature_self;
          setting.not_started = not_started;
          setting.on_going = on_going;
          setting.completed = completed;
          setting.save(async function (err) {
            if (err) {
              return res.status(422).json(responseData(err.message, {}, 422));
            } else {
              return res.json(responseData("RECODE_CREATED"));
            }
          });
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  updateSettingApi: async (req, res) => {
    try {
      const {
        email,
        name,
        support_email,
        address,
        copy_right,
        id,
        number,
        definition,
        sort_name,
        pickup_note,
        email_header,
        email_footer,
        payment_terms,
        banck_information,
        submit_request,
        key_personnel,
        chat_document,
        audit_conformation,
        signature_online,
        signature_self,
        not_started,
        on_going,
        completed,
      } = req.body;
      Setting.findOne({ _id: id }, async function (err, result) {
        if (err || !result) {
          return res.status(422).json(responseData("DATA_NOT_FOUND", {}, 422));
        } else {
          var setting = {};
          setting.email = email;
          setting.name = name;
          setting.sort_name = sort_name;
          setting.support_email = support_email;
          setting.address = address;
          setting.copy_right = copy_right;
          setting.number = number;
          setting.definition = definition;
          setting.payment_terms = payment_terms;
          setting.pickup_note = pickup_note;
          setting.email_header = email_header;
          setting.email_footer = email_footer;
          setting.banck_information = banck_information;
          setting.submit_request = submit_request;
          setting.key_personnel = key_personnel;
          setting.chat_document = chat_document;
          setting.audit_conformation = audit_conformation;
          setting.signature_online = signature_online;
          setting.signature_self = signature_self;
          setting.not_started = not_started;
          setting.on_going = on_going;
          setting.completed = completed;
          await Setting.findOneAndUpdate({ _id: result._id }, setting);
          return res.json(responseData("SETTING_UPDATE"));
        }
      });
    } catch (err) {
      return res.status(422).json(responseData(err.message, {}, 422));
    }
  },
  getSettingsRow: async () => {
    try {
      return await Setting.findOne({}, async function (err, result) {
        return result;
      });
    } catch (err) {
      return err;
    }
  },
};
