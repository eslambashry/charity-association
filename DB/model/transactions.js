import { model, Schema } from "mongoose";

 
const transactionSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export const transaction = model('Transaction', transactionSchema);
