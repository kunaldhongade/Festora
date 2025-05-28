// app/api/events/create/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  const { orderId, paymentId, eventData } = await req.json();

  console.log("Received create event request:", { orderId, paymentId, eventData });

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    console.log("Fetched payment:", payment);

    if (payment.status !== 'captured' || payment.order_id !== orderId) {
      console.log("Payment verification failed due to status/order_id mismatch");
      return NextResponse.json(
        { error: 'Payment not verified' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const result = await db.collection('events').insertOne({
      ...eventData,
      orderId,
      paymentId,
      createdAt: new Date(),
    });

    console.log("Inserted event ID:", result.insertedId);

    return NextResponse.json({ success: true, eventId: result.insertedId });
  } catch (err: any) {
    console.error('Payment verification failed:', err);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
