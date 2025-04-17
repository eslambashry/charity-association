import {product} from '../../../DB/model/product.js';

// ➕ Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, category, unit, price } = req.body;

    const newProduct = new product({ name, category, unit, price });
    const saved = await newProduct.save();

    res.status(201).json({ message: 'Product created', product: saved });
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

// 📥 Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// 🔍 Get One Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    
    const productExsist = await product.findById(id);
    
    
    if (!productExsist) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(productExsist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// ✏️ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

// ❌ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};
