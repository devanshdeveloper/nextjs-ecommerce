import { getImageFromBucket } from "./s3-bucket-front";

export async function urlToFile(url) {
  console.log(url);
  try {
    // Fetch the image data from the URL
    const response = await fetch(await getImageFromBucket({ Key: url }), {
      method: "GET",
      headers: {
        "Content-Type": "image/" + url.split(".")[url.split(".").length - 1],
      },
      mode: "no-cors",
    });
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
