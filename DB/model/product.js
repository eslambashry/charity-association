import  { model, Schema } from "mongoose";

 
const productSchema = new Schema({
  name: { type: String, required: true },
  category: String,
  unit: String, // كيلو، لتر، عبوة...
  price: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export const product = model('product', productSchema);

