import { Inventory } from "../../../DB/model/inventory.js";

export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().populate('product');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id).populate('product');

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid inventory ID format' });
    }
    res.status(500).json({ error: err.message });
  }
}

export const createInventory = async (req, res) => {
  try {
    const { product, volume } = req.body;
    const newInventory = new Inventory({
      product,
      volume:{
        quantity: volume.quantity,
        unit: volume.unit
      }
    }); 
    await newInventory.save();
    res.status(201).json(newInventory);
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { product } = req.body;
    const quantity = req.body.volume?.quantity;
    const unit = req.body.volume?.unit;

    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { product, volume: { quantity, unit } },
      { new: true, runValidators: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(updatedInventory);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid inventory ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInventory = await Inventory.findByIdAndDelete(id);

    if (!deletedInventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid inventory ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};
