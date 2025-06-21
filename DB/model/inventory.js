import { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    volume: {
      quantity: { type: Number, required: true }, // الكمية المتاحة
      unit: { type: String, required: true }, // الوحدة (كيلو، لتر، عبوة...)
    },
    last_updated: { type: Date, default: Date.now }
  },{timestamps:true});

  export const Inventory = model('inventory', inventorySchema);