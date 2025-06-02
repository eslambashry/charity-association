
import { Router } from "express";
import * as inventoryRoutertCont from './inventory.controller.js'
 
const inventoryRouter = Router()


inventoryRouter.get('/all', inventoryRoutertCont.getInventory);
inventoryRouter.get('/:id', inventoryRoutertCont.getInventoryById);
inventoryRouter.post('/create', inventoryRoutertCont.createInventory);
inventoryRouter.put('/:id', inventoryRoutertCont.updateInventory);
inventoryRouter.delete('/:id', inventoryRoutertCont.deleteInventory);

export default inventoryRouter