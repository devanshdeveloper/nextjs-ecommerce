import connectDB from "@/lib/mongoose";


export async function POST() {
  await connectDB();
  return Response.json({ message: "THIS IS WORKING AGAIN" }, { status: 200 });
}
