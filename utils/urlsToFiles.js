import { getImageFromBucket } from "./s3-bucket-front";

function getS3KeyFromUrl(url) {
  const regex = /https:\/\/[^\/]+\/([^?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function urlToFile(url) {
  console.log(url);
  try {
    const response = await fetch(
      await getImageFromBucket({ Key: getS3KeyFromUrl(url) }),
      {
        method: "GET",
      }
    );
    console.log("response: " + JSON.stringify(response));

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();
    console.log("blob: " + JSON.stringify(blob));

    // Extract the filename from the URL
    const urlParts = url.split("/");
    const filenameWithParams = urlParts[urlParts.length - 1];
    const filename = filenameWithParams.split("?")[0];

    // Extract the MIME type from the Blob
    const mimeType = blob.type;

    // Create a File object from the Blob
    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    console.error("Failed to fetch the image:", error);
    return null;
  }
}
