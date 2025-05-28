"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentButtonProps {
  /** Amount in INR (whole rupees) */
  amount: number;
  /** Called when payment succeeds */
  onSuccess: (paymentId: string, orderId: string) => void;
}

export function PaymentButton({ amount, onSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // 1. create order
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const order: { id: string; amount: number; currency: string } = await res.json();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      // 2. configure checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "Festora",
        description: "Event creation fee",
        order_id: order.id,
        handler: (resp: { razorpay_payment_id: string; razorpay_order_id: string }) => {
          console.log("Payment successful:", resp);
          onSuccess(resp.razorpay_payment_id, resp.razorpay_order_id);
        },
        modal: {
          escape: true,
          ondismiss: () => {
            console.log("Payment modal closed by user");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(err.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Load Razorpay SDK after interactive */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onError={() => console.error("Razorpay SDK failed to load")}
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        {loading ? "Loading…" : `Pay ₹${amount}`}
      </button>
    </div>
  );
}
