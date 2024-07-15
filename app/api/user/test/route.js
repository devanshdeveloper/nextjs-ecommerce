import connectDB from "@/lib/mongoose";
export async function GET() {
  await connectDB();
  return Response.json({ message: "THIS IS WORKING" }, { status: 200 });
}
