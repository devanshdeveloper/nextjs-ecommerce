import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import MyModal from "./Modal";
import { useCallback, useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import setCanvasPreview from "@/utils/setCanvasPreview";
import { Button } from "@nextui-org/react";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

function ImageCropModal({
  isOpenCropModal,
  onOpenChangeCropModal,
  onCloseCropModal,
  selectedImage,
  setSelectedImage,
  handleDataURL,
}) {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }, []);

  useEffect(() => {
    const file = selectedImage;
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  }, [selectedImage]); // eslint-disable-line

  return (
    <MyModal
      {...{ isOpen: isOpenCropModal, onOpenChange: onOpenChangeCropModal }}
    >
      <div className="flex flex-col gap-5 p-5">
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {imgSrc && (
          <div className="flex flex-col gap-5 items-center">
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
            >
              <NextImage
                ref={imgRef}
                src={imgSrc}
                alt="Upload"
                style={{ maxHeight: "70vh" }}
                width={500}
                height={500}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Button
              variant="flat"
              color="primary"
              onPress={() => {
                setCanvasPreview(
                  imgRef.current, // HTMLImageElement
                  previewCanvasRef.current, // HTMLCanvasElement
                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                  )
                );
                const dataUrl = previewCanvasRef.current.toDataURL();
                onCloseCropModal();
                handleDataURL(dataUrl);
              }}
            >
              Crop Image
            </Button>
          </div>
        )}
        {crop && (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
              display: "none",
              border: "1px solid black",
              objectFit: "contain",
              width: 150,
              height: 150,
            }}
          />
        )}
      </div>
    </MyModal>
  );
}

export default ImageCropModal;
