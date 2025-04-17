import { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true },
    last_updated: { type: Date, default: Date.now }
  });

  export const Inventory = model('inventory', inventorySchema);