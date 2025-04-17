
import { Router } from "express";
import * as inventoryRoutertCont from './inventory.controller.js'
 
const inventoryRouter = Router()


inventoryRouter.get('/all', inventoryRoutertCont.getInventory);

export default inventoryRouter