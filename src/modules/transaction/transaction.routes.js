
import { Router } from "express";
import * as transactionCont from './transaction.controller.js'
 
const transactionRouter = Router()

transactionRouter.post('/create', transactionCont.createTransaction)
transactionRouter.get('/all', transactionCont.getTransactions)
transactionRouter.get('/:id', transactionCont.getTransactionById)
transactionRouter.put('/:id', transactionCont.updateTransaction)
transactionRouter.delete('/:id', transactionCont.deleteTransaction)


export default transactionRouter
