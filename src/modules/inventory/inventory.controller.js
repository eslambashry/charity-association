import { Inventory } from "../../../DB/model/inventory.js";

export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().populate('product');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
