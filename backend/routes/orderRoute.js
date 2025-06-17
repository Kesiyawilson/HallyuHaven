import express from 'express'
import {placeOrder,placeOrderRazorpay,allOrders,updateStatus,userOrders} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter=express.Router()
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/RAZORPAY',authUser,placeOrderRazorpay)
orderRouter.post('/userorders',authUser,userOrders)

export default orderRouter
