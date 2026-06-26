/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Hospital, ServicePrice, Appointment } from "../types";
import { TIME_SLOTS } from "../data";
import { CreditCard, Smartphone, Check, ShieldAlert, Sparkles, AlertCircle, RefreshCw, Landmark, QrCode } from "lucide-react";

interface PaymentWizardProps {
  hospital: Hospital;
  service: ServicePrice;
  onSuccess: (appointment: Appointment) => void;
  onCancel: () => void;
}

export default function PaymentWizard({ hospital, service, onSuccess, onCancel }: PaymentWizardProps) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDayOffset, setSelectedDayOffset] = useState(1); // 1 = Tomorrow, 2 = Day after tomorrow, etc.
  const [formError, setFormError] = useState("");

  const [paymentMode, setPaymentMode] = useState<"UPI" | "Card" | "NetBanking">("UPI");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processingState, setProcessingState] = useState<"idle" | "securing" | "processing" | "webhook" | "completed">("idle");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const [upiVirtualId, setUpiVirtualId] = useState("");

  // Dates generators
  const getSimulatedDate = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      dayStr: d.toLocaleDateString("en-US", { weekday: "long" }),
      dateStr: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      rawStr: d.toISOString().split("T")[0],
    };
  };

  const dates = [
    getSimulatedDate(1), // Tomorrow
    getSimulatedDate(2), // Day after
    getSimulatedDate(3), // 3 days
  ];

  const targetDate = dates.find((_, idx) => idx + 1 === selectedDayOffset) || dates[0];

  // Pricing math
  const basePrice = service.price;
  const gstTax = Math.round(basePrice * 0.05); // 5% GST
  const bookingFee = 90; // Standard 90 rupees convenience booking fee
  const totalAmount = basePrice + gstTax + bookingFee;

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFormError("Patient name is required");
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 10) {
      setFormError("Valid 10-digit phone number is required");
      return;
    }
    if (!selectedSlot) {
      setFormError("Please select an available booking time slot");
      return;
    }
    setFormError("");
    setShowCheckoutModal(true);
  };

  // Simulate payment processing sequence (Recruiter Flex: shows webhook verification)
  const handleProcessPayment = () => {
    if (paymentMode === "Card") {
      if (!cardNumber || cardNumber.length < 16) {
        setOtpError("Please enter valid 16-digit card number");
        return;
      }
      if (!cardExpiry) {
        setOtpError("Enter card expiration");
        return;
      }
      if (!cardCVV) {
        setOtpError("Enter CVV code");
        return;
      }
      setOtpError("");
      if (!otpSent) {
        setOtpSent(true);
        return; // wait for OTP confirmation
      }
      if (otpInput !== "1234") {
        setOtpError("Verify with standard sandbox test OTP code: 1234");
        return;
      }
    }

    if (paymentMode === "UPI" && !upiVirtualId.includes("@")) {
      setOtpError("Enter valid UPI address (e.g. name@okhdfcbank)");
      return;
    }

    setOtpError("");
    setProcessingState("securing");
    
    // Simulate API link securing state
    setTimeout(() => {
      setProcessingState("processing");
      
      // Simulate client payment authorization
      setTimeout(() => {
        setProcessingState("webhook");
        
        // Simulate Razorpay Webhook Event: payment.captured received at /api/webhooks/pricing
        setTimeout(() => {
          setProcessingState("completed");
          
          // Complete appointment dispatch after 1s
          setTimeout(() => {
            const finalAppointment: Appointment = {
              id: `CC-${Math.floor(100000 + Math.random() * 900000)}`,
              hospitalId: hospital.id,
              hospitalName: hospital.name,
              serviceName: service.name,
              price: totalAmount,
              date: targetDate.dateStr,
              timeSlot: selectedSlot,
              patientName: patientName,
              patientPhone: patientPhone,
              status: "Confirmed",
              paymentStatus: "Paid",
              paymentId: `pay_${Math.random().toString(36).substring(2, 11)}`,
              createdAt: new Date().toLocaleDateString("en-IN"),
            };
            onSuccess(finalAppointment);
          }, 1000);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6" id="appointment-booking-wizard">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
        <div>
          <h3 className="text-lg font-display font-bold text-slate-800">
            Secure Appointment Booking
          </h3>
          <p className="text-xs text-slate-500">
            Provide details to secure direct diagnostics reservations.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>

      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
            {service.category}
          </span>
          <h4 className="text-base font-bold text-slate-800 mt-1">{service.name}</h4>
          <p className="text-xs text-slate-500 line-clamp-1">{hospital.name}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">Service Cost</span>
          <p className="text-xl font-bold text-slate-800">₹{service.price.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <form onSubmit={handleOpenCheckout} className="space-y-5">
        {formError && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-lg flex items-center gap-2 text-xs border border-rose-200">
            <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Name */}
          <div>
            <label htmlFor="patient-name-input" className="text-xs text-slate-600 font-bold block mb-1">Patient Full Name *</label>
            <input
              id="patient-name-input"
              type="text"
              required
              placeholder="e.g. Anjali Sharma"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
            />
          </div>

          {/* Patient Phone */}
          <div>
            <label htmlFor="patient-phone-input" className="text-xs text-slate-600 font-bold block mb-1">Patient Phone Number *</label>
            <input
              id="patient-phone-input"
              type="tel"
              required
              maxLength={10}
              placeholder="10-digit mobile (e.g. 9812345678)"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Date Selection tabs */}
        <div>
          <label className="text-xs text-slate-600 font-bold block mb-2">Select Diagnostic Schedule Date *</label>
          <div className="grid grid-cols-3 gap-2.5">
            {dates.map((item, idx) => {
              const offsetNo = idx + 1;
              const isSelected = selectedDayOffset === offsetNo;
              return (
                <button
                  key={offsetNo}
                  type="button"
                  onClick={() => setSelectedDayOffset(offsetNo)}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/40 text-indigo-900 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                    {offsetNo === 1 ? "TOMORROW" : item.dayStr.substring(0, 3)}
                  </span>
                  <span className="text-xs font-semibold block mt-0.5">{item.dateStr.split(",")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="text-xs text-slate-600 font-bold block mb-2">Available Daily Slots (Select Spot) *</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`text-xs font-medium py-2 rounded-lg transition ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Billing Ledger summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <span className="font-bold text-slate-800 block uppercase tracking-wider mb-1 text-[10px]">
            Fare Diagnostics Breakdowns
          </span>
          <div className="flex justify-between">
            <span>Base Procedure Test Rate</span>
            <span className="font-mono">₹{basePrice.toLocaleString("en-IN")}.00</span>
          </div>
          <div className="flex justify-between">
            <span>Clinical Healthcare Cess (5% CGST/SGST)</span>
            <span className="font-mono">₹{gstTax.toLocaleString("en-IN")}.00</span>
          </div>
          <div className="flex justify-between">
            <span>Appointment Verification Booking Fee</span>
            <span className="font-mono">₹{bookingFee.toLocaleString("en-IN")}.00</span>
          </div>
          <div className="flex justify-between font-bold border-t border-slate-200 pt-2 text-slate-800 text-sm mt-1">
            <span>Cumulative Total Estimated Billing</span>
            <span className="text-teal-600 font-mono">₹{totalAmount.toLocaleString("en-IN")}.00</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition flex justify-center items-center gap-2 shadow-md cursor-pointer"
        >
          <Smartphone className="h-5 w-5" />
          Proceed to Secure Checkout
        </button>
      </form>

      {/* RAZORPAY EMULATION checkout overlay modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="razorpay-overlay">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col animate-scale-up">
            {/* Header branding */}
            <div className="bg-indigo-900 text-white p-5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold bg-indigo-800 text-indigo-300 border border-indigo-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  CareCompare Sandbox Gateway
                </span>
                <span className="text-xs text-indigo-300 font-medium font-mono">ID: mid_9872</span>
              </div>
              <h4 className="text-xl font-display font-extrabold flex items-center gap-2">
                <Sparkles className="h-5.5 w-5.5 text-indigo-400" />
                Razorpay Checkout
              </h4>
              <p className="text-xs text-indigo-200 mt-1">
                Testing sandbox. Secure payment verification active.
              </p>
            </div>

            {/* Core container changing states */}
            {processingState !== "idle" ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                {processingState === "securing" && (
                  <>
                    <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
                    <div>
                      <h4 className="font-bold text-slate-800">Generating Secure Billing Link</h4>
                      <p className="text-xs text-slate-500 mt-1">Contacting Razorpay central servers...</p>
                    </div>
                  </>
                )}
                {processingState === "processing" && (
                  <>
                    <RefreshCw className="h-10 w-10 text-amber-500 animate-spin" />
                    <div>
                      <h4 className="font-bold text-slate-800">Authorizing Safe Funds Transfer</h4>
                      <p className="text-xs text-slate-500 mt-1">Transacting requested fee. Please do not close...</p>
                    </div>
                  </>
                )}
                {processingState === "webhook" && (
                  <>
                    <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin" />
                    <div>
                      <h4 className="font-bold text-slate-800">Synchronizing Hospital Database</h4>
                      <p className="text-xs text-slate-500 mt-1">Awaiting merchant capture callback on port 3000...</p>
                    </div>
                  </>
                )}
                {processingState === "completed" && (
                  <>
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                      <Check className="h-10 w-10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Transaction Confirmed!</h4>
                      <p className="text-xs text-emerald-600 mt-1">Authorized ID received. Generating invoice...</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-5 flex-1 flex flex-col space-y-4">
                {/* Total rate display */}
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase">SECURED AMOUNT TO TRANSFER</p>
                    <p className="sky-text text-sm font-semibold text-slate-800 text-slate-600 truncate">{service.name}</p>
                  </div>
                  <p className="text-2xl font-bold font-mono text-indigo-900">₹{totalAmount.toLocaleString("en-IN")}</p>
                </div>

                {otpError && (
                  <div className="bg-rose-50 text-rose-700 p-2.5 rounded-lg text-[11px] border border-rose-200">
                    {otpError}
                  </div>
                )}

                {/* Secure Gateway Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setPaymentMode("UPI"); setOtpSent(false); }}
                    className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 border transition ${
                      paymentMode === "UPI"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-800"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaymentMode("Card"); }}
                    className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 border transition ${
                      paymentMode === "Card"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-800"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Card Details
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaymentMode("NetBanking"); setOtpSent(false); }}
                    className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 border transition ${
                      paymentMode === "NetBanking"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-800"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Landmark className="h-4 w-4" />
                    NetBanking
                  </button>
                </div>

                {/* Sub Panel Content */}
                <div className="p-3 border border-slate-200 rounded-xl space-y-3">
                  {paymentMode === "UPI" && (
                    <div className="space-y-3">
                      <div className="flex gap-3 justify-center items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <QrCode className="h-10 w-10 text-slate-700" />
                        <div className="text-[10px] text-slate-500">
                          <p className="font-bold text-slate-700">Dynamic Scan-To-Pay Active</p>
                          <p>We accept GPay, PhonePe, Paytm, BHIM</p>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="upi-vpa-input" className="text-[10px] text-slate-500 block mb-0.5">Or enter UPI ID (VPA) *</label>
                        <input
                          id="upi-vpa-input"
                          type="text"
                          placeholder="e.g. rahul@okaxis"
                          value={upiVirtualId}
                          onChange={(e) => setUpiVirtualId(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMode === "Card" && (
                    <div className="space-y-2">
                      {!otpSent ? (
                        <>
                          <div>
                            <label htmlFor="card-number-input" className="text-[10px] text-slate-500 block mb-0.5">Card Number *</label>
                            <input
                              id="card-number-input"
                              type="text"
                              maxLength={16}
                              placeholder="4111 2222 3333 4444 (Test Card)"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label htmlFor="card-expiry-input" className="text-[10px] text-slate-500 block mb-0.5">Expiry *</label>
                              <input
                                id="card-expiry-input"
                                type="text"
                                maxLength={5}
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono"
                              />
                            </div>
                            <div>
                              <label htmlFor="card-cvv-input" className="text-[10px] text-slate-500 block mb-0.5">CVV *</label>
                              <input
                                id="card-cvv-input"
                                type="password"
                                maxLength={3}
                                placeholder="***"
                                value={cardCVV}
                                onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ""))}
                                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-600 bg-amber-50 p-2 border border-amber-200 rounded-lg font-medium">
                            Enter verification test OTP code: <span className="font-bold underline text-indigo-700">1234</span> sent to {patientPhone.substring(0, 3)}****{patientPhone.substring(7, 10)}
                          </p>
                          <div>
                            <label htmlFor="otp-verify-input" className="text-[10px] text-slate-500 block mb-0.5">Verification OTP Code *</label>
                            <input
                              id="otp-verify-input"
                              type="text"
                              placeholder="Enter 1234"
                              maxLength={4}
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              className="w-full text-center tracking-widest font-mono text-sm p-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMode === "NetBanking" && (
                    <div>
                      <p className="text-[11px] text-slate-500 block mb-1">Select Bank Corporate Portal</p>
                      <select className="w-full text-xs p-2 border border-slate-200 rounded-lg text-slate-800 bg-white">
                        <option>State Bank of India (SBI)</option>
                        <option>HDFC Bank Ltd</option>
                        <option>ICICI Bank Corporate Portal</option>
                        <option>Axis Bank Commercial</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 py-3 text-xs bg-slate-150 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-medium transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    className="flex-1 py-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-md cursor-pointer"
                  >
                    {paymentMode === "Card" && !otpSent ? "Send OTP Code" : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                PCI-DSS Compliant 256-Bit SSL
              </span>
              <span>Razorpay API v3</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
