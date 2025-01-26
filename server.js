const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productGroup: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

// API Endpoints
// Create a product
app.post('/inventory', async (req, res) => {
  try {
    const product = new Inventory(req.body);
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Get all products
app.get('/inventory', async (req, res) => {
  try {
    const products = await Inventory.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update stock quantity
app.put('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
