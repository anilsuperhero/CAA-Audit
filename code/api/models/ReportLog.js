const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ReportLogSchema = mongoose.Schema(
  {
    audit_id: { type: Schema.Types.ObjectId, ref: "Audits", required: true },
    audit_number: { type: String, required: false },
    company_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    report: { type: String, required: false },
    report_name: { type: String, required: false },
    report_remarks: { type: String, required: false },
    status: {
      type: String,
      enum: ["UPLOAD", "ACCEPT", "REJECT"],
      default: "UPLOAD",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: { getters: true, setters: true, virtuals: false },
    toJSON: { getters: true, setters: true, virtuals: false },
  }
);

ReportLogSchema.set("toObject", { getters: true });
ReportLogSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("report_logs", ReportLogSchema);
