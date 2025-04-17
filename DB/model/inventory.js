import { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    last_updated: { type: Date, default: Date.now }
  });

  export const inventory = model('inventory', inventorySchema);