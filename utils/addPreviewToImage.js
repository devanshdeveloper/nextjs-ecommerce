function addPreviewToImage(file) {
  return Object.assign(file, { preview: URL.createObjectURL(file) });
}

export default addPreviewToImage;
