
import { Router } from "express";
import * as productCont from './product.controller.js'
 
const productRouter = Router()


productRouter.post('/create',productCont.createProduct)
productRouter.get('/all',productCont.getAllProducts)
productRouter.get('/:id',productCont.getProductById)
productRouter.put('/:id',productCont.updateProduct)
productRouter.delete('/:id',productCont.deleteProduct)
    


export default productRouter
