import { model, Schema } from "mongoose";

const caseSchema = new Schema({
  fullName: { type: String, required: true, trim: true }, // الاسم الرباعي
  birthDate: { type: Date, required: true },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    required: true
  },
  childrenCount: { type: Number, default: 0, min: 0 },
  classification: {
    type: String, 
    enum: ['orphans', 'A', 'B'],
    required: true
  },
  notes: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// إضافة فهرس للبحث السريع
caseSchema.index({ fullName: 'text' });
caseSchema.index({ classification: 1, isActive: 1 });
caseSchema.index({ maritalStatus: 1, isActive: 1 });

export const Case = model('case', caseSchema);
