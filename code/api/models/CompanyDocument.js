const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

function status(val) {
  return val === 1 ? true : false;
}

function ucFirst(v) {
  if (v) return v[0].toUpperCase() + v.substring(1);
  return v;
}

const CompanyDocument = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    audit_id: {
      type: Schema.Types.ObjectId,
      ref: "AuditRequest",
      required: true,
    },
    title: { type: String, get: ucFirst, require: true },
    description: { type: String, get: ucFirst, required: false },
    image: { type: String, require: true },
    document_name: { type: String, require: true },
    status: { type: Number, get: status, required: false, default: 1 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
CompanyDocument.set("toObject", { getters: true });
CompanyDocument.set("toJSON", { getters: true });

CompanyDocument.plugin(mongoosePaginate),
  (module.exports = mongoose.model("company_documents", CompanyDocument));
