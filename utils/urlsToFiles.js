export function getS3KeyFromUrl(url) {
  if (!url) return null;
  const urlObj = new URL(url);
  const isS3Url = urlObj.hostname.endsWith('amazonaws.com') || urlObj.hostname.includes('s3');
  if (!isS3Url) {
    return url; 
  }
  const pathname = urlObj.pathname;
  const s3Key = decodeURIComponent(pathname.slice(1)); 
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
