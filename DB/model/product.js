import { model, Schema } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['مواد غذائية','مواد غير غذائية'],},
  unit: { type: String, required: true }, // كيلو، لتر، عبوة، كرتونة، شكارة...
  unitDescription: { type: String }, // وصف تفصيلي للوحدة، مثل: "كرتونة تحتوي على 6 زجاجات"
  subunitQuantity: { type: Number }, // كمية الوحدات الفرعية في الوحدة الرئيسية
  subunitType: { type: String }, // نوع الوحدة الفرعية (زجاجة، كيس، علبة...)
  price: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

export const product = model('product', productSchema);