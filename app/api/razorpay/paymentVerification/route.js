export async function POST(request) {
  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update((razorpay_order_id + "|" + razorpay_payment_id).toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    Response.json({
      razorpay_payment_id,
      success: true,
    });
  } else {
    Response.json({
      error: "Invalid Signature",
      success: false,
    });
  }
  Response.json({ success: true, order });
}
