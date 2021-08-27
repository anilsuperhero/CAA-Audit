const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Unique = require("mongoose-beautiful-unique-validation");
var slug = require("mongoose-slug-updater");
var Schema = mongoose.Schema;
const config = require("../config/config");
const fs = require("fs");

function ucFirst(v) {
  return v[0].toUpperCase() + v.substring(1);
}

function documentURL(image) {
  const path = config.DOCUMENT_PATH + "/" + image;
  if (fs.existsSync(path)) {
    return process.env.API_PATH + config.DOCUMENT_IMAGE_PATH + "/" + image;
  } else {
    return null;
  }
}

const AuditRequestSchema = mongoose.Schema(
  {
    title: { type: String, get: ucFirst, required: true },
    slug: { type: String, slug: "title", lowercase: true },
    audit_number: { type: String, required: false },
    company_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lead: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    peer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    support: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    type: { type: String, enum: config.AUDIT_TYPE, default: "VERIFICATION" },
    size_of_company: { type: Number, required: true },
    number_of_clients: { type: Number, required: true },
    registration_group: { type: Array, default: [] },
    selectedDocument: { type: Array, default: [] },
    keyStaff: { type: Array, default: [] },
    status_view: {
      type: String,
      enum: config.AUDIT_STATUS,
      default: "CREATED",
    },
    status: {
      type: String,
      enum: config.AUDIT_STATUS,
      default: "CREATED",
    },
    sla_document: { type: String, get: documentURL, required: false },
    sla_document_name: { type: String, required: false },
    sla_document_old: { type: String, required: false },
    sla_document_sign: { type: String, get: documentURL, required: false },
    sla_document_sign_name: { type: String, required: false },
    sla_document_sign_old: { type: String, required: false },
    amount: { type: Number, required: false },
    advance_payment: { type: Number, required: false },
    final_payment: { type: Number, required: false },
    remarks: { type: String, required: false },
    invoice_number: { type: Number, required: false },
    invoice_document: { type: String, get: documentURL, required: false },
    invoice_document_name: { type: String, required: false },
    invoice_document_old: { type: String, required: false },
    isPayment: { type: Boolean, required: false, default: false },
    is_advance: { type: Boolean, required: false, default: false },
    is_final: { type: Boolean, required: false, default: false },
    is_document: { type: Boolean, required: false, default: false },
    sign_type: {
      type: String,
      enum: ["SELF", "DOCUSIGN", "NO"],
      default: "NO",
    },
    total_document: { type: Number, required: false, default: 0 },
    uploaded_document: { type: Number, required: false, default: 0 },
    is_request: { type: Number, required: false, default: 0 },
    audit_date: { type: String, required: false },
    description: { type: String, required: false },
    report: { type: String, required: false },
    report_name: { type: String, required: false },
    report_remarks: { type: String, required: false },
    isCertification: { type: Boolean, required: false, default: false },
    audit_date_stage: { type: String, required: false },
    description_stage: { type: String, required: false },
    report_stage: { type: String, required: false },
    report_name_stage: { type: String, required: false },
    report_remarks_stage: { type: String, required: false },
    startDate: { type: String, required: false },
    endDate: { type: String, required: false },
    startDateStage: { type: String, required: false },
    endDateStage: { type: String, required: false },
    documentComplete: { type: Date, required: false },
    is_stage: { type: Boolean, required: false, default: false },
    is_auditor: { type: Boolean, required: false, default: false },
    reminderInfo: { type: Object, required: false, default: {} },
    required_additional_doc: { type: Boolean, required: false, default: false },
    required_additional_doc_company: {
      type: Boolean,
      required: false,
      default: false,
    },
    payment_reminder: { type: Boolean, required: false, default: false },
    onGoing: { type: Number, required: false, default: 0 },
    is_start: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: { getters: true, setters: true, virtuals: false },
    toJSON: { getters: true, setters: true, virtuals: false },
  }
);

AuditRequestSchema.set("toObject", { getters: true });
AuditRequestSchema.set("toJSON", { getters: true });
AuditRequestSchema.plugin(Unique);
AuditRequestSchema.plugin(mongoosePaginate);
AuditRequestSchema.plugin(aggregatePaginate);
AuditRequestSchema.plugin(slug),
  (module.exports = mongoose.model("AuditRequest", AuditRequestSchema));
