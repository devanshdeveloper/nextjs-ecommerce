export const parseImages = (files) => {
  if (!files) return;
  return [...files].map((file) => {
    return {
      image: URL.createObjectURL(file),
      filename: file.name,
      file,
    };
  });
};
