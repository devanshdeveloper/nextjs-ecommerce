import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";

export async function PUT(request) {
  const { id, newAddress } = await request.json();

  try {
    await connectDB();
    const address = await Address.findById(id);
    if (!address) {
      return Response.json({ error: "Address not found" }, { status: 404 });
    }
    for (const key in newAddress) {
      if (newAddress.hasOwnProperty(key)) {
        address[key] = newAddress[key];
      }
    }
    await address.save();
    return Response.json(address, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
