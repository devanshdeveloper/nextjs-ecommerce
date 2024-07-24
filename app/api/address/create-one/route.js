import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
export async function POST(request) {
  const body = await request.json();
  try {
    await connectDB();
    const newAddress = await Address.create(body);
    return Response.json(newAddress);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
