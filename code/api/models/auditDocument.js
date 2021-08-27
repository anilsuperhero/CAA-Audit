const { Schema, model } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const AuditDocumentSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "User" },
    auditId: { type: Schema.Types.ObjectId, ref: "AuditRequest" },
    registrationId: { type: Schema.Types.ObjectId, ref: "RegistrationGroup" },
    documentId: { type: Schema.Types.ObjectId, ref: "DocumentType" },
    staffId: { type: Schema.Types.ObjectId, ref: "KeyPersonnel" },
    document_name: { type: String, required: false },
    document: { type: String, required: false },
    document_image_name: { type: String, required: false },
    description: { type: String, required: false },
    type: { type: String, required: false },
    status: { type: Number, required: false },
    applicable: { type: Number, required: false, default: 1 },
    remarks: { type: String, required: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: { getters: true, setters: true, virtuals: false },
    toJSON: { getters: true, setters: true, virtuals: false },
  }
);

AuditDocumentSchema.plugin(aggregatePaginate);
AuditDocumentSchema.plugin(mongoosePaginate);
module.exports = model("auditDocument", AuditDocumentSchema);
