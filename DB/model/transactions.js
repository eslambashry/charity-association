import { model, Schema } from "mongoose";

const transactionSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'case' }, // مرجع للحالة المستفيدة
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

export const transaction = model('transaction', transactionSchema);


