import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { Button, useDisclosure } from "@nextui-org/react";
import { Edit, X } from "lucide-react";
import ImageCropModal from "../modals/ImageCropModal";
import { dataURLtoFile } from "@/utils/dataURLToFile";
import addPreviewToImage from "@/utils/addPreviewToImage";

function ImageUploaderInput({ acceptedImages, setAcceptedImages }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    isOpen: isOpenCropModal,
    onOpen: onOpenCropModal,
    onOpenChange: onOpenChangeCropModal,
    onClose: onCloseCropModal,
  } = useDisclosure();

  const handleDataURL = useCallback(
    (dataUrl) => {
      const file = addPreviewToImage(
        dataURLtoFile(dataUrl, selectedImage.name)
      );
      setAcceptedImages((prevImages) =>
        prevImages.map((currImage) => {
          if (currImage.name === selectedImage.name) {
            return file;
          }
          return currImage;
        })
      );
    },
    [selectedImage?.name]
  );

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setAcceptedImages((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map(addPreviewToImage),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: true,
  });

  return (
    <>
      <div className="">
        <div
          {...getRootProps()}
          className="border-4 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center mb-4 hover:border-blue-500 transition duration-300 ease-in-out"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            Drag &apos;n&apos; drop an image here, or click to select one
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {acceptedImages.map((image) => {
            return (
              <div key={image.name} className="relative flex flex-col gap-5">
                <Image
                  src={image.preview}
                  alt=""
                  className="w-full"
                  width={100}
                  height={100}
                />
                <Button
                  color="primary"
                  className="absolute right-10 top-1"
                  isIconOnly
                  size="sm"
                  onPress={() => {
                    setSelectedImage(image);
                    onOpenChangeCropModal();
                  }}
                >
                  <Edit size={20} />
                </Button>
                <Button
                  color="danger"
                  className="absolute right-1 top-1"
                  isIconOnly
                  size="sm"
                  onPress={() =>
                    setAcceptedImages((prevImages) =>
                      prevImages.filter(
                        (currImage) => currImage.name !== image.name
                      )
                    )
                  }
                >
                  <X size={20} />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <ImageCropModal
        {...{
          isOpenCropModal,
          selectedImage,
          setSelectedImage,
          onOpenChangeCropModal,
          onOpenCropModal,
          onCloseCropModal,
          handleDataURL,
        }}
      />
    </>
  );
}

export default ImageUploaderInput;