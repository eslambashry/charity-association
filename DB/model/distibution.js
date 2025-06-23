import { model, Schema } from "mongoose";

const distributionSchema = new Schema({
  beneficiary: { type: Schema.Types.ObjectId, ref: 'beneficiary', required: true },
  items: [
    {
      inventory: { type: Schema.Types.ObjectId, ref: 'inventory', required: true },
      quantity: { type: Number, required: true }, // الكمية الموزعة
      unit: { type: String, required: true }, // الوحدة
    }
  ],
  notes: { type: String },
  distributed_at: { type: Date, default: Date.now }
}, { timestamps: true });

export const Distribution = model('distribution', distributionSchema);