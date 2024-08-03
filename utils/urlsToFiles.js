export function getS3KeyFromUrl(url) {
  if (!url) return null;

  // Create a URL object
  const urlObj = new URL(url);

  // Extract the pathname from the URL
  const pathname = urlObj.pathname;

  // Decode URL components to handle encoded spaces and special characters
  const s3Key = decodeURIComponent(pathname.slice(1)); // Remove leading slash

  return s3Key;
}



export async function urlToFile(url) {
  console.log(url);
  try {
    const response = await fetch(url, {
      method: "GET",
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
