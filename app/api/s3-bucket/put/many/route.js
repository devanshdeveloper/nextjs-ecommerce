import { putObjectURL } from "@/utils/s3-bucket";

export async function POST(request) {
  const body = await request.json();
  if (!Array.isArray(body)) {
    return Response.json({ error: "Body must be an array" }, { status: 500 });
  }
  try {
    const response = await Promise.all(
      body.map(({ Key, fileType }) => {
        const extension = fileType.split("/")[1];
        return putObjectURL({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: Key,
          Expires: 60,
          ContentType: `image/${extension}`,
        });
      })
    );
    let res = {};
    response.forEach((obj) => {
      res[Object.keys(obj)[0]] = Object.values(obj)[0];
    });
    return Response.json(res);
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
