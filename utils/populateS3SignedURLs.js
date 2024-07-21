import { getObjectURL } from "./s3-bucket";

async function populateS3SignedURLs(data) {
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    const images = product.images;
    for (let j = 0; j < images.length; j++) {
      const imageURL = images[j];
      if (imageURL.startsWith("/") || imageURL.startsWith("http")) {
        continue;
      } else {
        data[i].images[j] = (
          await getObjectURL({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageURL,
          })
        )[imageURL];
      }
    }
  }
  return data;
}

export default populateS3SignedURLs;
