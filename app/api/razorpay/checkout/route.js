import url from "@/utils/url";

export async function POST(request) {
  const { searchParams } = url(request.url);
  const order = await instance.orders.create({
    amount: Number(searchParams.get("amount") * 100),
    currency: "INR",
  });
  Response.json({ success: true, order });
}
