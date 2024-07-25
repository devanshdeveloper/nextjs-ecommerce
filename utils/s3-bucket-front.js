import fetchApi from "./fetchApi";

export async function uploadImageToBucket({ Key, imageToUpload }) {
  try {
    const fileType = encodeURIComponent(imageToUpload.type);
    const data = await fetchApi(
      `/api/s3-bucket/put/one?Key=${Key}&fileType=${fileType}`,
      {
        method: "POST",
      }
    );

    if (data && data[Key]) {
      const res = await fetch(data[Key], {
        method: "PUT",
        headers: {
          "Content-Type": imageToUpload.type,
        },
        body: imageToUpload,
      });

      if (!res.ok) {
        throw new Error(`Failed to upload image. Status: ${res.status}`);
      }

      let json;
      try {
        json = await res.json();
      } catch (error) {
        console.error("Failed to parse JSON response", error);
      }

    } else {
      throw new Error("Failed to get the S3 bucket URL");
    }
  } catch (error) {
    console.error("Error uploading image to S3 bucket:", error);
  }
}

export async function uploadImagesToBucket(images) {
  if (images.length === 0) {
    return;
  }
  try {
    const data = await fetchApi(`/api/s3-bucket/put/many`, {
      method: "POST",
      body: images.map(({ Key, fileType }) => ({
        Key,
        fileType,
      })),
    });
    await Promise.all(
      Object.entries(data).map(([Key, url]) => {
        return fetch(url, {
          method: "PUT",
          body: images.find((image) => image.Key === Key).file,
        });
      })
    );
    return images.map((image) => image.Key);
  } catch (error) {
    console.log(error);
  }
}

export async function getImageFromBucket({ Key }) {
  try {
    const data = await fetchApi(`/api/s3-bucket/get/one?Key=${Key}`, {
      method: "POST",
    });
    if (data) {
      return data[Key];
    }
  } catch (error) {
    console.log(error);
  }
}
export async function getImagesFromBucket(...keys) {
  let imageKeys = {};
  keys.forEach((key) => {
    if (key.startsWith("/") || key.startsWith("http")) {
      imageKeys[key] = key;
      keys.filter((currentKey) => currentKey === key);
    }
  });

  try {
    return {
      ...imageKeys,
      ...(await fetchApi(`/api/s3-bucket/get/many`, {
        method: "POST",
        body: keys,
      })),
    };
  } catch (error) {
    console.log(error);
  }
}
