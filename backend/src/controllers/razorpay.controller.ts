import { Request, RequestHandler, Response } from "express";
import {createOrder as createRazorpayOrder} from "../services/razorpay";
import { Transaction } from "../models/admin/transaction.modal";
import { ServiceBooking } from "../models/admin/servicebooking.modal";
import { error } from "../Handlers";

export const createOrder: RequestHandler = async (req: any, res, next): Promise<any> => {
  try {
    const { bookingId, amount } = req.body;
    const receiptId = `RC-${Date.now()}`;
    const booking = await ServiceBooking.findOne({
      where: {
        id: bookingId
      }
    });
    if(!booking){
      return error(res, {
        msg: "Invalid booking id!!"
      });
    }
    
      const razorpayResponse = await createRazorpayOrder({amount, receiptId})
      console.log(razorpayResponse);
      await Transaction.create({
        transactionId: receiptId,
        razorpayTransactionId: razorpayResponse.id,
        amount: amount,
        status: 0,
        userId: req.user?.id,
        serviceBookingId: bookingId
      })
      res.status(200).json({
        status: true,
        msg: "Transaction created successfully",
        data: razorpayResponse
      });
  } catch (error) {
    next(error);
  }
};