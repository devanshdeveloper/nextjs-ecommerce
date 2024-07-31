import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let userId = searchParams.get("userId");
  try {
    await connectDB();
    if (userId.length !== 24)
      return Response.json({ error: "Invalid Id" }, { status: 500 });
    const addresses = await Address.find({ user: userId });
    if (addresses.length === 0)
      return Response.json({ error: "Address not found" }, { status: 404 });
    return Response.json(addresses);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
