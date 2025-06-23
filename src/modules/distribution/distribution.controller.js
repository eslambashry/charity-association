// Express route example

import { Distribution } from "../../../DB/model/distibution.js";
import { Inventory } from "../../../DB/model/inventory.js";




export const create = async (req, res) => {
  const { beneficiary, items, notes } = req.body;
    
  // 1. تحقق من الكميات في الـ Inventory
  for (const item of items) {
    const _inventory = await Inventory.findById(item.inventory);
    if (!_inventory) return res.status(404).json({ error: 'Inventory not found' });
    if (_inventory.volume.quantity < item.quantity) {
      return res.status(400).json({ error: `Insufficient quantity for ${_inventory.product}` });
    }
  }

  // 2. أنقص الكمية من الـ Inventory
  for (const item of items) {
    await Inventory.findByIdAndUpdate(
      item.inventory,
      { $inc: { 'volume.quantity': -item.quantity }, last_updated: new Date() }
    );
  }

  // 3. أنشئ التوزيع
  const distribution = await Distribution.create({
    beneficiary,
    items,
    notes
  });
  console.log(`Distribution created: ${distribution}`);
  
  res.status(201).json(distribution);
};




export const getAll = async (req, res) => {
  const distributions = await Distribution.find()
    .populate('beneficiary')
    .populate({
      path: 'items.inventory',
      populate: { path: 'product' }
    });
  res.json(distributions);
};