import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Daraja API configuration
const DARAJA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortCode: process.env.MPESA_SHORTCODE || '174379',
  passkey: process.env.MPESA_PASSKEY!,
  callbackURL: process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa-callback',
};

// Define the return type interface
interface MpesaResponse {
  success: boolean;
  transactionId?: string;
  checkoutRequestID?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  console.log(' M-Pesa Rental Payment endpoint called');
  
  try {
    const body = await req.json();
    console.log(' Request body received:', body);

    const { 
      carId, 
      carName, 
      rentalDays, 
      pickupDate, 
      dropoffDate,
      totalAmount, 
      phoneNumber, 
      carImage,
      userId,
      pickupLocation,
      dropoffLocation,
      specialRequests
    } = body;

    if (!carId || !carName || !totalAmount || !phoneNumber || !userId) {
      console.log(' Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(' All required fields present');

    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(' Formatted phone number:', formattedPhone);

    if (!DARAJA_CONFIG.consumerKey || !DARAJA_CONFIG.consumerSecret) {
      console.error(' Missing M-Pesa environment variables');
      return NextResponse.json(
        { success: false, message: 'M-Pesa service not configured' },
        { status: 500 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        carId: parseInt(carId),
        startDate: new Date(pickupDate),
        endDate: new Date(dropoffDate),
        totalPrice: parseFloat(totalAmount),
        pickupLocation,
        dropoffLocation,
        specialRequests,
        status: 'PENDING'
      }
    });

    console.log(' Booking created:', booking.id);

    // Process M-Pesa payment - FIX: Add await and proper typing
    const mpesaResponse: MpesaResponse = await initiateMpesaPayment({
      phoneNumber: formattedPhone,
      amount: totalAmount,
      accountReference: `CAR-${carId}`,
      transactionDesc: `Car Rental: ${carName}`,
    });

    console.log(' M-Pesa API response:', mpesaResponse);

    if (mpesaResponse.success) {
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          checkoutRequestID: mpesaResponse.checkoutRequestID!,
          transactionId: mpesaResponse.transactionId!,
          carId: parseInt(carId),
          userId: parseInt(userId),
          bookingId: booking.id,
          phoneNumber: formattedPhone,
          amount: parseFloat(totalAmount),
          accountReference: `CAR-${carId}`,
          transactionDesc: `Car Rental: ${carName}`,
          status: 'PENDING',
          metadata: {
            carName,
            rentalDays,
            pickupDate,
            dropoffDate,
            carImage,
            pickupLocation,
            dropoffLocation
          }
        }
      });

      console.log(' Payment record created:', payment.id);

      return NextResponse.json({ 
        success: true,
        message: 'Payment initiated successfully. Check your phone for STK push.',
        checkoutRequestID: mpesaResponse.checkoutRequestID,
        transactionId: mpesaResponse.transactionId,
        bookingId: booking.id,
        paymentId: payment.id
      });
    } else {
      // Update booking status if payment fails
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' }
      });

      console.log(' M-Pesa payment failed:', mpesaResponse.message);
      return NextResponse.json(
        { success: false, message: mpesaResponse.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error(' M-Pesa payment error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing payment' },
      { status: 500 }
    );
  }
}

// Format phone number to 254 format
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.startsWith('+254')) {
    return cleaned.substring(1);
  } else {
    return '254' + cleaned;
  }
}

// Generate Daraja API access token
async function getAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${DARAJA_CONFIG.consumerKey}:${DARAJA_CONFIG.consumerSecret}`).toString('base64');
    
    console.log(' Getting access token...');
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' Access token error:', response.status, errorText);
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Access token received');
    return data.access_token;
  } catch (error) {
    console.error(' Error getting access token:', error);
    throw error;
  }
}

// Generate Lipa Na M-Pesa password
function generatePassword(): string {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${DARAJA_CONFIG.shortCode}${DARAJA_CONFIG.passkey}${timestamp}`).toString('base64');
  return password;
}

// FIXED: Initiate M-Pesa STK Push with proper return type
async function initiateMpesaPayment(paymentData: {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<MpesaResponse> { // ADD RETURN TYPE
  try {
    console.log(' Initiating M-Pesa STK Push...');
    
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    const requestBody = {
      BusinessShortCode: DARAJA_CONFIG.shortCode,
      Password: generatePassword(),
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: paymentData.amount,
      PartyA: paymentData.phoneNumber,
      PartyB: DARAJA_CONFIG.shortCode,
      PhoneNumber: paymentData.phoneNumber,
      CallBackURL: DARAJA_CONFIG.callbackURL,
      AccountReference: paymentData.accountReference,
      TransactionDesc: paymentData.transactionDesc,
    };

    console.log(' STK Push request body:', requestBody);

    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log(' STK Push API response:', responseData);

    if (responseData.ResponseCode === '0') {
      return { // RETURN THE OBJECT
        success: true,
        transactionId: `MPESA_${Date.now()}`,
        checkoutRequestID: responseData.CheckoutRequestID,
        message: 'STK push sent successfully. Check your phone.',
      };
    } else {
      console.error(' STK Push failed:', responseData);
      return { // RETURN THE OBJECT
        success: false,
        message: responseData.ResponseDescription || 'Failed to initiate STK push',
      };
    }
  } catch (error) {
    console.error(' M-Pesa STK Push error:', error);
    return { // RETURN THE OBJECT
      success: false,
      message: 'Error initiating M-Pesa payment. Please try again.',
    };
  }
}