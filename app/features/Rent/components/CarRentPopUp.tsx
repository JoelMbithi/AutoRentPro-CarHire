"use client";
import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { FaGasPump, FaUserFriends, FaCog, FaTimes, FaMobileAlt } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import { CarProps } from '@/app/features/car-listing/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStep = 'details' | 'payment' | 'confirmation';

interface CarRentPopUpProps {
  showPopup: boolean;
  selectedCar: CarProps | null;
  closePopup: () => void;
  user?: { id: number; name?: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  const cleaned = price.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
};

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0'))        return '254' + cleaned.slice(1);
  if (cleaned.startsWith('254'))      return cleaned;
  if (cleaned.startsWith('+254'))     return cleaned.slice(1);
  if (cleaned.length === 9)           return '254' + cleaned;
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
const MAX_POLL_ATTEMPTS  = 36; // ~90 seconds

// ─── Sub-components ───────────────────────────────────────────────────────────

const Spinner: React.FC = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

interface SummaryRowProps {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
  accent?: boolean;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, bold, accent }) => (
  <div className={`flex justify-between ${bold ? 'font-semibold text-gray-900 pt-2 border-t border-gray-200 mt-1' : 'text-gray-600'} text-sm`}>
    <span>{label}</span>
    <span className={accent ? 'text-green-600 font-semibold' : bold ? 'text-gray-900' : ''}>{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CarRentPopUp: React.FC<CarRentPopUpProps> = ({
  showPopup,
  selectedCar,
  closePopup,
  user,
}) => {
  const [rentalDays, setRentalDays]   = useState<number>(1);
  const [pickupDate, setPickupDate]   = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('details');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pollController, setPollController] = useState<AbortController | null>(null);

  // ── Derived state ──────────────────────────────────────────────────────────

  const total = useMemo(() => {
    if (!selectedCar) return 0;
    const days  = Math.max(1, Number(rentalDays) || 1);
    const price = parsePrice(selectedCar.price);
    return days * price;
  }, [rentalDays, selectedCar]);

  const dropoffDate = useMemo(() => addDays(pickupDate, rentalDays), [pickupDate, rentalDays]);

  // ── Handlers ───────────────────────────────────────────────────────────────

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

  const handleRentalDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setRentalDays(isNaN(val) || val < 1 ? 1 : val);
  };

  const handleProceedToPayment = () => {
    if (!pickupDate) {
      alert('Please select a pickup date.');
      return;
    }
    setPaymentStep('payment');
  };

  const handleCancelPayment = () => {
    pollController?.abort();
    setIsProcessing(false);
    setPaymentStep('payment');
  };

  const handleCompleteRental = () => {
    resetState();
    closePopup();
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
      // 1. Initiate STK push
      const initiateRes = await fetch('/features/Rent/api/mpesa-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          carId:            selectedCar!.id,
          carName:          selectedCar!.name,
          carImage:         selectedCar!.img,
          rentalDays,
          pickupDate,
          dropoffDate,
          totalAmount:      total,
          phoneNumber:      formatPhoneNumber(phoneNumber),
          userId:           user.id,
          pickupLocation:   'Nairobi',
          dropoffLocation:  'Nairobi',
          specialRequests:  '',
        }),
      });

      if (!initiateRes.ok) {
        const err = await initiateRes.json();
        throw new Error(err.message || `Request failed (${initiateRes.status})`);
      }

      const { success, checkoutRequestID, message } = await initiateRes.json();

      if (!success) throw new Error(message || 'Payment initiation failed.');

      // 2. Poll for status
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

        if (statusData.paymentStatus === 'COMPLETED') {
          setPaymentStep('confirmation');
          return;
        }

        if (statusData.paymentStatus === 'FAILED') {
          throw new Error(statusData.payment?.failureReason || 'Payment was declined or cancelled.');
        }
      }

      throw new Error('Payment confirmation timed out. Please check your M-Pesa messages.');

    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return; // user cancelled
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      alert(`Payment failed: ${msg}`);
      setPaymentStep('payment');
    } finally {
      setIsProcessing(false);
      setPollController(null);
    }
  };

  // ── Guard ──────────────────────────────────────────────────────────────────

  if (!showPopup || !selectedCar) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  const stepTitle: Record<PaymentStep, string> = {
    details:      `Rent ${selectedCar.name}`,
    payment:      'M-Pesa Payment',
    confirmation: 'Booking Confirmed',
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
            {stepTitle[paymentStep]}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all"
          >
            <FaTimes size={13} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* STEP 1 — Details */}
          {paymentStep === 'details' && (
            <>
              {/* Car summary */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                  <Image src={selectedCar.img} alt={selectedCar.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{selectedCar.name}</p>
                  <p className="text-orange-600 text-sm font-medium mt-0.5">
                    Ksh {parsePrice(selectedCar.price).toLocaleString()} <span className="text-gray-400 font-normal">/ day</span>
                  </p>
                </div>
              </div>

              {/* Car specs */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <FaGasPump />,     label: selectedCar.fuelType },
                  { icon: <IoSpeedometer />, label: selectedCar.gear },
                  { icon: <FaUserFriends />, label: `${selectedCar.seats} seats` },
                  { icon: <FaCog />,         label: selectedCar.drive },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                    <span className="text-gray-400">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>

              {/* Rental inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                    Rental Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rentalDays}
                    onChange={handleRentalDaysChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={todayISO()}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Summary</p>
                <SummaryRow label={selectedCar.name} value={`Ksh ${parsePrice(selectedCar.price).toLocaleString()} × ${rentalDays}`} />
                {pickupDate && <SummaryRow label="Drop-off" value={formatDate(dropoffDate)} />}
                <SummaryRow label="Total" value={`Ksh ${total.toLocaleString()}`} bold />
              </div>
            </>
          )}

          {/* STEP 2 — Payment */}
          {paymentStep === 'payment' && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Summary</p>
                <SummaryRow label={selectedCar.name} value={`Ksh ${parsePrice(selectedCar.price).toLocaleString()} × ${rentalDays} days`} />
                <SummaryRow label="Pickup"   value={formatDate(pickupDate)} />
                <SummaryRow label="Drop-off" value={formatDate(dropoffDate)} />
                <SummaryRow label="Total" value={`Ksh ${total.toLocaleString()}`} bold />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="0712 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  A payment prompt of <strong className="text-gray-600">Ksh {total.toLocaleString()}</strong> will be sent to this number.
                </p>
              </div>

              {isProcessing && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <Spinner />
                  <div>
                    <p className="text-sm font-medium text-green-800">Waiting for payment…</p>
                    <p className="text-xs text-green-600 mt-0.5">Check your phone and enter your M-Pesa PIN.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 3 — Confirmation */}
          {paymentStep === 'confirmation' && (
            <>
              <div className="flex flex-col items-center py-4 text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Successful</h3>
                  <p className="text-sm text-gray-500 mt-1">We'll contact you shortly to confirm your pickup details.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <SummaryRow label="Vehicle"       value={selectedCar.name} />
                <SummaryRow label="Pickup date"   value={formatDate(pickupDate)} />
                <SummaryRow label="Drop-off date" value={formatDate(dropoffDate)} />
                <SummaryRow label="Rental period" value={`${rentalDays} day${rentalDays > 1 ? 's' : ''}`} />
                <SummaryRow label="Total paid"    value={`Ksh ${total.toLocaleString()}`} bold accent />
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-200">
          {paymentStep === 'details' && (
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={!pickupDate}
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {paymentStep === 'payment' && (
            <div className="flex gap-3">
              <button
                onClick={isProcessing ? handleCancelPayment : () => setPaymentStep('details')}
                disabled={false}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
              >
                {isProcessing ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handleMpesaPayment}
                disabled={isProcessing || !phoneNumber}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <><Spinner /> Processing…</>
                ) : (
                  <><FaMobileAlt /> Pay with M-Pesa</>
                )}
              </button>
            </div>
          )}

          {paymentStep === 'confirmation' && (
            <button
              onClick={handleCompleteRental}
              className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRentPopUp;