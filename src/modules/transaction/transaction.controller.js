 import { Inventory } from "../../../DB/model/inventory.js";
 import { transaction } from "../../../DB/model/transactions.js";



export const createTransaction = async (req, res) => {
  try {
    const { product_id, type, quantity, date, recipient, notes } = req.body;

    let inventory = await Inventory.findOne({ product: product_id });
    
    // ❗إذا العملية "out"، نتحقق من وجود كمية كافية
    if (type === 'out') {
      if (!inventory || inventory.quantity < quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock in inventory. Available: ${inventory ? inventory.quantity : 0}` 
        });
      }
    }

    // إنشاء المعاملة
    const transactionData = new transaction({
      product: product_id,
      type,
      quantity,
      date,
      recipient,
      notes
    });

    const saved = await transactionData.save();

    // تحديث أو إنشاء سجل الجرد
    if (!inventory) {
      inventory = new Inventory({ product: product_id, volume: 0 });
    }

    if (type === 'in') {
      inventory.volume.quantity += quantity;
    } else if (type === 'out') {
      inventory.volume.quantity -= quantity;
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
      const transactions = await transaction.find().populate('product').populate('recipient');
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // ✅ Read One
  export const getTransactionById = async (req, res) => {
    try {
      const transactionExsist = await transaction.findById(req.params.id).populate('product').populate('recipient');
      if (!transactionExsist) return res.status(404).json({ error: 'Transaction not found' });
      res.json(transactionExsist);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
export const updateTransaction = async (req, res) => {
  try {
    const { product, type, quantity, date, reference, notes } = req.body;
    
    // الحصول على المعاملة الحالية لمعرفة القيم القديمة
    const oldTransaction = await transaction.findById(req.params.id);
    if (!oldTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // إذا تم تغيير المنتج أو النوع أو الكمية، نحتاج لتحديث المخزون
    const shouldUpdateInventory = 
      product !== oldTransaction.product.toString() ||
      type !== oldTransaction.type ||
      quantity !== oldTransaction.quantity;

    if (shouldUpdateInventory) {
      // إعادة المخزون للحالة السابقة (عكس المعاملة القديمة)
      let oldInventory = await Inventory.findOne({ product: oldTransaction.product });
      if (oldInventory) {
        if (oldTransaction.type === 'in') {
          oldInventory.quantity -= oldTransaction.quantity;
        } else if (oldTransaction.type === 'out') {
          oldInventory.quantity += oldTransaction.quantity;
        }
        oldInventory.last_updated = new Date();
        await oldInventory.save();
      }

      // تطبيق المعاملة الجديدة
      let newInventory = await Inventory.findOne({ product: product });
      
      // التحقق من الكمية المتاحة للمعاملات الصادرة
      if (type === 'out') {
        if (!newInventory || newInventory.quantity < quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock in inventory. Available: ${newInventory ? newInventory.quantity : 0}` 
          });
        }
      }

      if (!newInventory) {
        newInventory = new Inventory({ product: product, quantity: 0 });
      }

      if (type === 'in') {
        newInventory.quantity += quantity;
      } else if (type === 'out') {
        newInventory.quantity -= quantity;
      }

      newInventory.last_updated = new Date();
      await newInventory.save();
    }

    // تحديث المعاملة
    const updated = await transaction.findByIdAndUpdate(
      req.params.id,
      { product, type, quantity, date, reference, notes },
      { new: true, runValidators: true }
    ).populate('product').populate('reference');

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
  