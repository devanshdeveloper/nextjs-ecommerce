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

// const ImageUploader = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [crop, setCrop] = useState({
//     unit: "%",
//     x: 25,
//     y: 25,
//     width: 50,
//     height: 50,
//   });
//   const [completedCrop, setCompletedCrop] = useState(null);
//   const imageRef = useRef(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       setSelectedImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: "image/*",
//     multiple: false,
//   });

//   const handleImageLoaded = (image) => {
//     imageRef.current = image;
//     const initialCrop = {
//       unit: "%", // Can be 'px' or '%'
//       x: 25,
//       y: 25,
//       width: 50,
//       height: 50,
//     };
//     setCrop(initialCrop);
//   };

//   const handleCropComplete = (crop) => {
//     setCompletedCrop(crop);
//   };

//   const handleCropChange = (newCrop) => {
//     setCrop((prevCrop) => ({
//       ...prevCrop,
//       ...newCrop,
//     }));
//   };

//   const handleCompressAndCrop = async () => {
//     if (!completedCrop || !imageRef.current) {
//       return;
//     }

//     const image = imageRef.current;
//     const canvas = document.createElement("canvas");
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;
//     canvas.width = completedCrop.width;
//     canvas.height = completedCrop.height;
//     const ctx = canvas.getContext("2d");

//     ctx.drawImage(
//       image,
//       completedCrop.x * scaleX,
//       completedCrop.y * scaleY,
//       completedCrop.width * scaleX,
//       completedCrop.height * scaleY,
//       0,
//       0,
//       completedCrop.width,
//       completedCrop.height
//     );

//     const base64Image = canvas.toDataURL("image/jpeg");
//     const blob = await (await fetch(base64Image)).blob();

//     const options = {
//       maxSizeMB: 1,
//       maxWidthOrHeight: 800,
//       useWebWorker: true,
//     };

//     const compressedFile = await imageCompression(blob, options);
//     const compressedImageURL = URL.createObjectURL(compressedFile);
//     setCroppedImage(compressedImageURL);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div
//         {...getRootProps()}
//         className="border-4 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center mb-4 hover:border-blue-500 transition duration-300 ease-in-out"
//       >
//         <input {...getInputProps()} />
//         <p className="text-gray-500">
//           Drag &apos;n&apos; drop an image here, or click to select one
//         </p>
//       </div>
//       {selectedImage && (
//         <ReactCrop
//           src={selectedImage}
//           crop={crop}
//           onImageLoaded={handleImageLoaded}
//           onComplete={handleCropComplete}
//           onChange={handleCropChange}
//           className="mb-4"
//         />
//       )}
//       <button
//         onClick={handleCompressAndCrop}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
//       >
//         Compress and Crop
//       </button>
//       {croppedImage && (
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold mb-2">
//             Cropped and Compressed Image
//           </h3>
//           <Image
//             src={croppedImage}
//             alt="Cropped and Compressed"
//             className="max-w-full h-auto rounded shadow-lg"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;
