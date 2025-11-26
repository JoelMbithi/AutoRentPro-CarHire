"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { FaGasPump, FaUserFriends, FaCog, FaTimes, FaMobileAlt } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import { CarProps } from '@/app/features/car-listing/types';

interface CarRentPopUpProps {
  showPopup: boolean;
  selectedCar: CarProps | null;
  closePopup: () => void;
}

const CarRentPopUp: React.FC<CarRentPopUpProps> = ({ 
  showPopup, 
  selectedCar, 
  closePopup 
}) => {
  const [rentalDays, setRentalDays] = useState(1);
  const [pickupDate, setPickupDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  if (!showPopup || !selectedCar) return null;

  const calculateTotal = () => {
    return rentalDays * Number(selectedCar.price);
  };

  const handleProceedToPayment = () => {
    if (!pickupDate) {
      alert('Please select a pickup date');
      return;
    }
    setShowPayment(true);
    setPaymentStep('payment');
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      alert('Please enter your M-Pesa phone number');
      return;
    }

    // Validate phone number format (Kenyan)
    const phoneRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid Kenyan phone number');
      return;
    }

    try {
      setIsProcessing(true);

      // Call your M-Pesa API endpoint
      const response = await fetch('/api/mpesa-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: selectedCar.id,
          carName: selectedCar.name,
          rentalDays,
          pickupDate,
          totalAmount: calculateTotal(),
          phoneNumber: formatPhoneNumber(phoneNumber),
          carImage: selectedCar.img,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process M-Pesa payment');
      }

      const result = await response.json();
      
      if (result.success) {
        setPaymentStep('confirmation');
        // You might want to show a success message or redirect to a success page
      } else {
        alert('Payment failed: ' + (result.message || 'Please try again'));
      }

    } catch (error) {
      console.error('M-Pesa payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    // Convert to 254 format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('+254')) {
      return cleaned.substring(1);
    } else if (cleaned.length === 9) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const handleBackToDetails = () => {
    if (paymentStep === 'payment') {
      setPaymentStep('details');
    } else if (paymentStep === 'confirmation') {
      setPaymentStep('payment');
    }
  };

  const handleCompleteRental = () => {
    alert(`Congratulations! You've successfully rented the ${selectedCar.name}`);
    closePopup();
    // Reset states
    setPaymentStep('details');
    setPhoneNumber('');
    setShowPayment(false);
  };

  return (
    <div>
      {showPopup && selectedCar && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="relative p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black text-gray-900">
                {paymentStep === 'details' && `Rent ${selectedCar.name}`}
                {paymentStep === 'payment' && 'M-Pesa Payment'}
                {paymentStep === 'confirmation' && 'Payment Confirmation'}
              </h2>
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              {paymentStep === 'details' && (
                // Rental Details Form
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                      <Image
                        src={selectedCar.img}
                        alt={selectedCar.name}
                        fill
                        className="object-scale-down"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{selectedCar.name}</h3>
                      <p className="text-orange-600 font-bold text-lg">Ksh {selectedCar.price} / day</p>
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaGasPump className="text-orange-500" />
                      <span className="text-sm font-medium">{selectedCar.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <IoSpeedometer className="text-orange-500" />
                      <span className="text-sm font-medium">{selectedCar.gear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUserFriends className="text-orange-500" />
                      <span className="text-sm font-medium">{selectedCar.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCog className="text-orange-500" />
                      <span className="text-sm font-medium">{selectedCar.drive}</span>
                    </div>
                  </div>

                  {/* Rental Form */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rental Period (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={rentalDays}
                        onChange={(e) => setRentalDays(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{selectedCar.name}</span>
                        <span className="font-medium">Ksh {selectedCar.price} × {rentalDays}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-orange-600 text-lg">Ksh {calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentStep === 'payment' && (
                // M-Pesa Payment Section
                <>
                  <div className="text-center mb-6">
                    <FaMobileAlt className="text-4xl text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-black text-gray-900">M-Pesa Payment</h3>
                    <p className="text-gray-600 mt-2">Complete your rental with M-Pesa</p>
                  </div>

                  {/* Order Summary for Payment */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{selectedCar.name}</span>
                        <span className="font-medium">Ksh {selectedCar.price} × {rentalDays} days</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Pickup: {new Date(pickupDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="font-semibold text-gray-900">Total Amount</span>
                        <span className="font-bold text-orange-600 text-lg">Ksh {calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  {/* M-Pesa Phone Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      M-Pesa Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="07XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter your M-Pesa registered phone number
                    </p>
                  </div>

                  {/* Payment Instructions */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <FaMobileAlt className="text-white text-sm" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">M-Pesa Instructions</h5>
                        <p className="text-xs text-gray-600">
                          You will receive an M-Pesa prompt on your phone to confirm the payment of Ksh {calculateTotal()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentStep === 'confirmation' && (
                // Payment Confirmation Section
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaMobileAlt className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600">
                      Your M-Pesa payment of <strong>Ksh {calculateTotal()}</strong> was successful.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Rental Confirmed</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-medium">{selectedCar.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Date:</span>
                        <span className="font-medium">{new Date(pickupDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rental Period:</span>
                        <span className="font-medium">{rentalDays} days</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="font-semibold text-gray-900">Total Paid:</span>
                        <span className="font-bold text-green-600">Ksh {calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Next Steps</h5>
                    <p className="text-xs text-gray-600">
                      We will contact you shortly to confirm pickup details and location.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Popup Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl sticky bottom-0">
              {paymentStep === 'details' && (
                <div className="flex gap-3">
                  <button
                    onClick={closePopup}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!pickupDate}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}

              {paymentStep === 'payment' && (
                <div className="flex gap-3">
                  <button
                    onClick={handleBackToDetails}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Back to Details
                  </button>
                  <button
                    onClick={handleMpesaPayment}
                    disabled={isProcessing || !phoneNumber}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaMobileAlt />
                        Pay with M-Pesa
                      </>
                    )}
                  </button>
                </div>
              )}

              {paymentStep === 'confirmation' && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCompleteRental}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
                  >
                    Complete Rental
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarRentPopUp;