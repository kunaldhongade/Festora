// app/api/razorpay/order/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  const { amount } = await req.json();
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: { purpose: 'Event creation fee' },
  });
  return NextResponse.json(order);
}
