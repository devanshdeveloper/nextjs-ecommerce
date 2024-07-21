import { getObjectURL } from "@/utils/s3-bucket";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const Key = searchParams.get("Key");

  if (typeof Key !== "string") {
    return Response.json({ error: "Key is required string" }, { status: 500 });
  }

  try {
    const response = await getObjectURL({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Key,
      Expires: 60,
    });
    return Response.json(response);
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
