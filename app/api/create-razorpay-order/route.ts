import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const order = await razorpay.orders.create({
      amount: 99 * 100, // ₹99 in paise
      currency: "INR",
      receipt: `resume_${Date.now()}`,
    });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    const message = error?.error?.description || error?.message || "Failed to create order";
    return NextResponse.json({ error: message, details: error?.error || error?.statusCode || null }, { status: 500 });
  }
}
