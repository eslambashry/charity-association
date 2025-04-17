 import { Inventory } from "../../../DB/model/inventory.js";
 import { transaction } from "../../../DB/model/transactions.js";


export const createTransaction = async (req, res) => {
  try {
    const { product_id, type, quantity, date } = req.body;

    
    let inventory = await Inventory.findOne({ product: product_id });
    
    // ❗إذا العملية "out"، نتحقق من وجود كمية كافية
    if (type === 'out') {
      if (!inventory || inventory.quantity < quantity) {
        return res.status(400).json({ message: `Insufficient stock in inventory ${inventory.quantity}` });
      }
    }

    // إنشاء المعاملة
    const transactionData = new transaction({
      product:product_id,
      type,
      quantity,
      date
    });

    const saved = await transactionData.save();

    // تحديث أو إنشاء سجل الجرد
    if (!inventory) {
      inventory = new Inventory({ product:product_id, quantity: 0 });
    }

    if (type === 'in') {
      inventory.quantity += quantity;
    } else if (type === 'out') {
      inventory.quantity -= quantity;
    }

    inventory.last_updated = new Date();
    await inventory.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


  // ✅ Read All
export const getTransactions = async (req, res) => {
    try {
      const transactions = await transaction.find().populate('product');
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // ✅ Read One
  export const getTransactionById = async (req, res) => {
    try {
      const transactionExsist = await transaction.findById(req.params.id).populate('product');
      if (!transactionExsist) return res.status(404).json({ error: 'Transaction not found' });
      res.json(transactionExsist);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  export const updateTransaction = async (req, res) => {
    try {
      const { product, type, quantity, date } = req.body;
  
      const updated = await transaction.findByIdAndUpdate(
        req.params.id,
        { product, type, quantity, date },
        { new: true, runValidators: true }
      );
  
      if (!updated) return res.status(404).json({ error: 'Transaction not found' });
  
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  
  // ✅ Delete
export const deleteTransaction = async (req, res) => {
    try {
      const deleted = await transaction.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
      res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  