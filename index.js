import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectionDB } from './DB/connection.js';
import { config } from 'dotenv'
import path from 'path'
config({path: path.resolve('./config/.env')})

import userRouter from './src/modules/auth/auth.routes.js';
import productRouter from './src/modules/product/product.routes.js';
import transactionRouter from './src/modules/transaction/transaction.routes.js';
import inventoryRouter from './src/modules/inventory/inventory.routes.js';
import caseRoutes from './src/modules/case/case.routes.js';


const app = express();
app.use(json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            color: #333;
            padding: 40px;
            text-align: center;
          }
  
          h1 {
            color: #2c3e50;
          }
  
          h3 {
            color: #7f8c8d;
          }
  
          ul {
            list-style: none;
            padding: 0;
            max-width: 500px;
            margin: 30px auto;
          }
  
          li {
            margin: 10px 0;
          }
  
          a {
            text-decoration: none;
            color: black;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            transition: background-color 0.3s ease;
          }
  
          a:hover {
            background-color: #2980b9;
          }
  
          .route-info {
            font-size: 1em;
            color: #95a5a6;
            margin-top: 5px;
            font-weight: bold;
          }
  
          .route-type {
            font-size: 1.1em;
            color: #2ecc71;
          }
  
          .route-path {
            font-size: 1em;
            color: #e67e22;
            font-weight: bold;
            margin-top: 5px;
          }
  
          /* Styling for Products */
          .products-section {
            background-color: #ecf0f1;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
          }
  
          .products-section h3 {
            color: #3498db;
          }
  
          /* Styling for Transactions */
          .transactions-section {
            background-color: #f9ebea;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
          }
  
          .transactions-section h3 {
            color: #e74c3c;
          }
  
          /* Styling for Inventory */
          .inventory-section {
            background-color: #d5f5e3;
            padding: 20px;
            border-radius: 10px;
          }
  
          .inventory-section h3 {
            color: #2ecc71;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to My Server 🚀</h1>
  
        <!-- Products Section -->
        <div class="products-section">
          <h3>Available Product Routes:</h3>
          <ul>
            <li>
              <a href="/user/register">Register</a>
              <div class="route-info">
                <span class="route-type">[POST]</span> - Register a new user
              </div>
              <p class="route-path">/user/register</p>
            </li>
            <li>
              <a href="/product/create">Create Product</a>
              <div class="route-info">
                <span class="route-type">[POST]</span> - Create a new product
              </div>
              <p class="route-path">/product/create</p>
            </li>
            <li>
              <a href="/product/all">All Products</a>
              <div class="route-info">
                <span class="route-type">[GET]</span> - View all products
              </div>
              <p class="route-path">/product/all</p>
            </li>
            <li>
              <a href="/product/680107b6cfd8a1e8b6d60d98">Get Product</a>
              <div class="route-info">
                <span class="route-type">[GET]</span> - Get product details
              </div>
              <p class="route-path">/product/:id</p>
            </li>
            <li>
              <a href="/product/680107b6cfd8a1e8b6d60d98">Update Product</a>
              <div class="route-info">
                <span class="route-type">[PUT]</span> - Update product info
              </div>
              <p class="route-path">/product/:id</p>
            </li>
            <li>
              <a href="/product/680107b6cfd8a1e8b6d60d98">Delete Product</a>
              <div class="route-info">
                <span class="route-type">[DELETE]</span> - Delete a product
              </div>
              <p class="route-path">/product/:id</p>
            </li>
          </ul>
        </div>
  
        <!-- Transactions Section -->
        <div class="transactions-section">
          <h3>Available Transaction Routes:</h3>
          <ul>
            <li>
              <a href="/transaction/create">Create Transaction</a>
              <div class="route-info">
                <span class="route-type">[POST]</span> - Create a transaction
              </div>
              <p class="route-path">/transaction/create</p>
            </li>
            <li>
              <a href="/transaction/all">All Transactions</a>
              <div class="route-info">
                <span class="route-type">[GET]</span> - View all transactions
              </div>
              <p class="route-path">/transaction/all</p>
            </li>
            <li>
              <a href="/transaction/680107b6cfd8a1e8b6d60d98">Get Transaction</a>
              <div class="route-info">
                <span class="route-type">[GET]</span> - Get transaction details
              </div>
              <p class="route-path">/transaction/:id</p>
            </li>
            <li>
              <a href="/transaction/680107b6cfd8a1e8b6d60d98">Update Transaction</a>
              <div class="route-info">
                <span class="route-type">[PUT]</span> - Update transaction info
              </div>
              <p class="route-path">/transaction/:id</p>
            </li>
            <li>
              <a href="/transaction/680107b6cfd8a1e8b6d60d98">Delete Transaction</a>
              <div class="route-info">
                <span class="route-type">[DELETE]</span> - Delete a transaction
              </div>
              <p class="route-path">/transaction/:id</p>
            </li>
          </ul>
        </div>
  
        <!-- Inventory Section -->
        <div class="inventory-section">
          <h3>Available Inventory Routes:</h3>
          <ul>
            <li>
              <a href="/inventory/all">All Inventories</a>
              <div class="route-info">
                <span class="route-type">[GET]</span> - View all inventories
              </div>
              <p class="route-path">/inventory/all</p>
              </li>
              <li>
              <a href="/inventory/680107b6cfd8a1e8b6d60d98">Get Inventory</a>
              <div class="route-info">
              <span class="route-type">[GET]</span> - Get inventory details
              </div>
              <p class="route-path">/inventory/:id</p>
              </li>
              <li>
              <a href="/inventory/create">Create Inventory</a>
              <div class="route-info">
              <span class="route-type">[POST]</span> - Create a new inventory
              </div>
              <p class="route-path">/inventory/create</p>
              </li>
              <li>
              <a href="/inventory/680107b6cfd8a1e8b6d60d98">Update Inventory</a>
              <div class="route-info">
              <span class="route-type">[PUT]</span> - Update inventory info
              </div>
              <p class="route-path">/inventory/:id</p>
              </p>
              </li>
              <li>
              <a href="/inventory/680107b6cfd8a1e8b6d60d98">Delete Inventory</a>
              <div class="route-info">
              <span class="route-type">[DELETE]</span> - Delete an inventory
              </div>
              <p class="route-path">/inventory/:id</p>
              </li>
              >
              </html>
            <li>
              <a href="/cases">Cases</a>
              <div class="route-info
              <span class="route-type">[GET]</span> - View all cases
              </div>
              <p class="route-path">/cases</p>
              li>
              i>
              <a href="/cases/680107b6cfd8a1e8b6d60d98">Get Case</a>
              <div class="route-info">
              <span class="route-type">[GET]</span> - Get case details
              </div>
              <p class="route-path">/cases/:id</p>
              </li>
              <li>
              <a href="/cases/create">Create Case</a>
              <div class="route-info">
              <span class="route-type">[  POST]</span> - Create a new case
              </div>
              <p class="route-path">/cases/create</p>
              </li>
              <li>
              <a href="/cases/680107b6cfd8a1e8b6d60d98">Update Case</a>
              <div class="route-info">
              <span class="route-type">[PUT]</span> - Update case info
              </div>
              <p class="route-path">/cases/:id</p>
              </li>
              <li>
              <a href="/cases/680107b6cfd8a1e8b6d60d98">Delete Case</a>
              <div class="route-info">
              <span class="route-type">[DELETE]</span> - Delete a case
              </div>
              <p class="route-path">/cases/:id</p>
              </li>
              </ul>
              </div>

            </li>
          </ul>
        </div>
      </body>
    </html>
  `);
  
});

app.use('/user',userRouter)
app.use('/product',productRouter)
app.use('/transaction',transactionRouter)
app.use('/inventory',inventoryRouter)
app.use('/cases', caseRoutes);

 

connectionDB()
app.listen(5050, () => console.log('🚀 Server running on port 5050'));


 