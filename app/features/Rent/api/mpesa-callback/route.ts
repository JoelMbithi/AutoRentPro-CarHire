import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

//  CONTROL SWITCH - Change this to switch between modes
const PAYMENT_MODE = process.env.PAYMENT_MODE || 'PRODUCTION'; // 'TEST' or 'PRODUCTION'

export async function POST(req: NextRequest) {
  try {
    const callbackData = await req.json();
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));
    
    const stkCallback = callbackData.Body.stkCallback;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;
    const checkoutRequestID = stkCallback.CheckoutRequestID;

    console.log('Payment Result:', { resultCode, resultDesc, checkoutRequestID });
    console.log('Current Mode:', PAYMENT_MODE);

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestID },
      include: { booking: true }
    });

    if (!payment) {
      console.error(' Payment record not found for:', checkoutRequestID);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    }

    // =============================================
    //  DUAL MODE LOGIC - BOTH ACTIVE, CONTROLLED BY ENV VARIABLE
    // =============================================

    if (PAYMENT_MODE === 'TEST') {
      //  TEST MODE - Always complete payment (even when cancelled)
      console.log(' TEST MODE: Completing payment regardless of result');

      await prisma.payment.update({
        where: { checkoutRequestID },
        data: {
          status: 'COMPLETED',
          mpesaReceiptNumber: `TEST_${Date.now()}`,
          metadata: {
            ...(payment.metadata as any || {}),
            testMode: true,
            originalResultCode: resultCode,
            originalResultDesc: resultDesc
          }
        }
      });

      if (payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'CONFIRMED' }
        });
      }

      console.log(' TEST MODE: Payment and booking completed successfully');

    } else {
      //  PRODUCTION MODE - Real payment validation
      if (resultCode === 0) {
        //  Payment was successful
        const callbackMetadata = stkCallback.CallbackMetadata;
        const items = callbackMetadata.Item;

        const transactionData = {
          amount: items.find((item: any) => item.Name === 'Amount')?.Value,
          mpesaReceiptNumber: items.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value,
          transactionDate: items.find((item: any) => item.Name === 'TransactionDate')?.Value,
          phoneNumber: items.find((item: any) => item.Name === 'PhoneNumber')?.Value,
        };

        console.log(' PRODUCTION: Payment SUCCESS - Completing rental');

        await prisma.payment.update({
          where: { checkoutRequestID },
          data: {
            status: 'COMPLETED',
            mpesaReceiptNumber: transactionData.mpesaReceiptNumber,
            metadata: {
              ...(payment.metadata as any || {}),
              ...transactionData
            }
          }
        });

        if (payment.bookingId) {
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'CONFIRMED' }
          });
        }

        console.log(' PRODUCTION: Rental confirmed!');

      } else {
        //  Payment cancelled or failed
        console.log(' PRODUCTION: Payment FAILED - Rental NOT completed');

        await prisma.payment.update({
          where: { checkoutRequestID },
          data: {
            status: 'FAILED',
            failureReason: resultDesc
          }
        });

        if (payment.bookingId) {
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'CANCELLED' }
          });
        }

        console.log(' PRODUCTION: Rental cancelled due to payment failure');
      }
    }

    // =============================================
    //  Always respond success to M-Pesa (required by Daraja API)
    // =============================================
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });

  } catch (error) {
    console.error(' M-Pesa callback error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Error" });
  }
}