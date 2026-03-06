import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await req.json(); // consume body

    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
    const baseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Get access token
    const authRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await authRes.json();

    // Create order
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "5.00",
            },
            description: "ResumeAI - Professional PDF Resume",
          },
        ],
        application_context: {
          brand_name: "ResumeAI",
          return_url: `${appUrl}/builder?success=true`,
          cancel_url: `${appUrl}/builder`,
          user_action: "PAY_NOW",
        },
      }),
    });

    const order = await orderRes.json();
    const approvalUrl = order.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href;

    if (!approvalUrl) throw new Error("No approval URL from PayPal");

    return NextResponse.json({ url: approvalUrl });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
