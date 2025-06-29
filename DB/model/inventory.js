// import { model, Schema } from "mongoose";

// const inventorySchema = new Schema({
//     product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
//     volume: {
//       quantity: { type: Number, required: true }, // الكمية المتاحة
//       unit: { type: String, required: true }, // الوحدة (كيلو، لتر، عبوة...)
//     },
//     last_updated: { type: Date, default: Date.now }
//   },{timestamps:true});

//   export const Inventory = model('inventory', inventorySchema);

import { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['food', 'non-food', 'medical', 'clothing', 'other'], // You can adjust these based on your InventoryItemType
      required: true 
    },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true }, // الوحدة (كيلو، لتر، عبوة...)
    minimumLevel: { type: Number, required: true, min: 0 }, // الحد الأدنى للمخزون
    lastUpdated: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
}, { timestamps: true });

export const Inventory = model('inventory', inventorySchema);
