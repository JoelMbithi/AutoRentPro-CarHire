"use client";
import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { FaTimes, FaMobileAlt } from "react-icons/fa";
import { CarProps } from '@/app/features/car-listing/types';

type PaymentStep = 'details' | 'payment' | 'confirmation';

interface CarRentPopUpProps {
  showPopup: boolean;
  selectedCar: CarProps | null;
  closePopup: () => void;
  user?: { id: number; name?: string };
}

const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^\d.]/g, '')) || 0;
};

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0'))    return '254' + cleaned.slice(1);
  if (cleaned.startsWith('254'))  return cleaned;
  if (cleaned.startsWith('+254')) return cleaned.slice(1);
  if (cleaned.length === 9)       return '254' + cleaned;
  return cleaned;
};

const addDays = (dateStr: string, days: number): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const formatDate = (dateStr: string): string =>
  dateStr ? new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const todayISO = (): string => new Date().toISOString().split('T')[0];

const KENYAN_PHONE_REGEX = /^(?:254|\+254|0)?(7[0-9]{8})$/;
const POLL_INTERVAL_MS   = 2500;
const MAX_POLL_ATTEMPTS  = 36;

const Spinner: React.FC = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-orange-400 transition bg-white';
const labelClass = 'block text-sm text-gray-600 mb-1';

const CarRentPopUp: React.FC<CarRentPopUpProps> = ({
  showPopup, selectedCar, closePopup, user,
}) => {
  const [rentalDays, setRentalDays]     = useState<number>(1);
  const [pickupDate, setPickupDate]     = useState<string>('');
  const [phoneNumber, setPhoneNumber]   = useState<string>('');
  const [paymentStep, setPaymentStep]   = useState<PaymentStep>('details');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pollController, setPollController] = useState<AbortController | null>(null);

  const total = useMemo(() => {
    if (!selectedCar) return 0;
    return Math.max(1, Number(rentalDays) || 1) * parsePrice(selectedCar.price);
  }, [rentalDays, selectedCar]);

  const dropoffDate = useMemo(() => addDays(pickupDate, rentalDays), [pickupDate, rentalDays]);

  const resetState = useCallback(() => {
    setRentalDays(1);
    setPickupDate('');
    setPhoneNumber('');
    setPaymentStep('details');
    setIsProcessing(false);
    setPollController(null);
  }, []);

  const handleClose = useCallback(() => {
    pollController?.abort();
    resetState();
    closePopup();
  }, [pollController, resetState, closePopup]);

  const handleProceedToPayment = () => {
    if (!pickupDate) { alert('Please select a pickup date.'); return; }
    setPaymentStep('payment');
  };

  const handleCancelPayment = () => {
    pollController?.abort();
    setIsProcessing(false);
    setPaymentStep('payment');
  };

  const handleMpesaPayment = async () => {
    if (!user) {
      alert('Please log in to complete your rental.');
      handleClose();
      window.location.href = '/auth/signin?redirect=' + encodeURIComponent('/vehicles');
      return;
    }
    if (!KENYAN_PHONE_REGEX.test(phoneNumber)) {
      alert('Please enter a valid Kenyan phone number (e.g. 0712 345 678).');
      return;
    }

    const controller = new AbortController();
    setPollController(controller);
    setIsProcessing(true);

    try {
      const initiateRes = await fetch('/features/Rent/api/mpesa-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          carId: selectedCar!.id, carName: selectedCar!.name, carImage: selectedCar!.img,
          rentalDays, pickupDate, dropoffDate, totalAmount: total,
          phoneNumber: formatPhoneNumber(phoneNumber), userId: user.id,
          pickupLocation: 'Nairobi', dropoffLocation: 'Nairobi', specialRequests: '',
        }),
      });

      if (!initiateRes.ok) {
        const err = await initiateRes.json();
        throw new Error(err.message || `Request failed (${initiateRes.status})`);
      }

      const { success, checkoutRequestID, message } = await initiateRes.json();
      if (!success) throw new Error(message || 'Payment initiation failed.');

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, POLL_INTERVAL_MS);
          controller.signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); });
        });

        const statusRes = await fetch('/features/Rent/api/check-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ checkoutRequestID }),
        });

        if (!statusRes.ok) continue;
        const statusData = await statusRes.json();

        if (statusData.paymentStatus === 'COMPLETED') { setPaymentStep('confirmation'); return; }
        if (statusData.paymentStatus === 'FAILED') throw new Error(statusData.payment?.failureReason || 'Payment was declined or cancelled.');
      }

      throw new Error('Payment confirmation timed out. Please check your M-Pesa messages.');
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      alert(`Payment failed: ${err instanceof Error ? err.message : 'An unexpected error occurred.'}`);
      setPaymentStep('payment');
    } finally {
      setIsProcessing(false);
      setPollController(null);
    }
  };

  if (!showPopup || !selectedCar) return null;

  const stepTitle: Record<PaymentStep, string> = {
    details:      `Rent ${selectedCar.name}`,
    payment:      'M-Pesa Payment',
    confirmation: 'Booking Confirmed',
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded w-full max-w-md max-h-[92vh] flex flex-col border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">{stepTitle[paymentStep]}</h2>
          <button onClick={handleClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

          {/* Step 1 — Details */}
          {paymentStep === 'details' && (
            <>
              {/* Car summary */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-14 rounded overflow-hidden bg-gray-100 shrink-0">
                  <Image src={selectedCar.img} alt={selectedCar.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{selectedCar.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Ksh {parsePrice(selectedCar.price).toLocaleString()} <span className="text-gray-400">/ day</span>
                  </p>
                </div>
              </div>

              {/* Specs — plain text */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>{selectedCar.fuelType}</span>
                <span>{selectedCar.gear}</span>
                <span>{selectedCar.seats} seats</span>
                <span>{selectedCar.drive}</span>
              </div>

              {/* Rental inputs */}
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Rental days</label>
                  <input
                    type="number" min="1" value={rentalDays}
                    onChange={(e) => { const v = parseInt(e.target.value, 10); setRentalDays(isNaN(v) || v < 1 ? 1 : v); }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pickup date</label>
                  <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={todayISO()} className={inputClass} />
                </div>
              </div>

              {/* Order summary */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{selectedCar.name}</span>
                  <span>Ksh {parsePrice(selectedCar.price).toLocaleString()} × {rentalDays}</span>
                </div>
                {pickupDate && (
                  <div className="flex justify-between text-gray-600">
                    <span>Drop-off</span>
                    <span>{formatDate(dropoffDate)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>Ksh {total.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          {/* Step 2 — Payment */}
          {paymentStep === 'payment' && (
            <>
              <div className="border-t border-gray-100 pt-1 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>{selectedCar.name}</span><span>Ksh {parsePrice(selectedCar.price).toLocaleString()} × {rentalDays} days</span></div>
                <div className="flex justify-between text-gray-600"><span>Pickup</span><span>{formatDate(pickupDate)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Drop-off</span><span>{formatDate(dropoffDate)}</span></div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>Ksh {total.toLocaleString()}</span></div>
              </div>

              <div>
                <label className={labelClass}>M-Pesa phone number</label>
                <input
                  type="tel" placeholder="0712 345 678" value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">
                  A prompt of <span className="font-medium text-gray-600">Ksh {total.toLocaleString()}</span> will be sent to this number.
                </p>
              </div>

              {isProcessing && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded px-4 py-3">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Waiting for payment…</p>
                    <p className="text-xs text-green-600 mt-0.5">Check your phone and enter your M-Pesa PIN.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 3 — Confirmation */}
          {paymentStep === 'confirmation' && (
            <>
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Payment Successful</p>
                <p className="text-sm text-gray-500 mt-1">We'll contact you shortly to confirm your pickup details.</p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Vehicle</span><span>{selectedCar.name}</span></div>
                <div className="flex justify-between text-gray-600"><span>Pickup date</span><span>{formatDate(pickupDate)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Drop-off date</span><span>{formatDate(dropoffDate)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Rental period</span><span>{rentalDays} day{rentalDays > 1 ? 's' : ''}</span></div>
                <div className="flex justify-between font-semibold text-green-700 pt-2 border-t border-gray-100"><span>Total paid</span><span>Ksh {total.toLocaleString()}</span></div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200">
          {paymentStep === 'details' && (
            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleProceedToPayment} disabled={!pickupDate} className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Continue to Payment
              </button>
            </div>
          )}

          {paymentStep === 'payment' && (
            <div className="flex gap-3">
              <button
                onClick={isProcessing ? handleCancelPayment : () => setPaymentStep('details')}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors"
              >
                {isProcessing ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handleMpesaPayment}
                disabled={isProcessing || !phoneNumber}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? <><Spinner /> Processing…</> : <><FaMobileAlt size={12} /> Pay with M-Pesa</>}
              </button>
            </div>
          )}

          {paymentStep === 'confirmation' && (
            <button onClick={() => { resetState(); closePopup(); }} className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors">
              Done
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CarRentPopUp;