"use client";

// UI COMPONENTS
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

// UTILS
import { updateOneUser } from "@/fetch/user";
import parseError, { recursiveError } from "@/utils/parseError";
import {
  getImageFromBucket,
  getImagesFromBucket,
  uploadImagesToBucket,
} from "@/utils/s3-bucket-front";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { getS3KeyFromUrl, urlToFile } from "@/utils/urlsToFiles";

// COMPONENTS
import AvatarChanger from "@/components/inputs/AvatarChanger"; // Import AvatarChanger
import addPreviewToImage from "@/utils/addPreviewToImage";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";

// Helper function for form validation
const validateUserForm = (user) => {
  const errors = {};
  if (!user.name) errors.name = "Name is required";
  if (!user.email) errors.email = "Email is required";
  if (!user.image) errors.image = "Profile image is required";
  return Object.keys(errors).length ? errors : null;
};

function AccountEditPage({ editId }) {
  const { user, setUser } = useAuthContext();
  const router = useRouter();
  const [userInputValue, setUserInputValue] = useState({
    name: "",
    email: "",
    image: { url: "", file: null },
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const mutate_user = useMutation({
    mutationFn: async () => {
      const userToUpdate = { ...userInputValue };
      const validationErrors = validateUserForm(userToUpdate);
      if (validationErrors) {
        setErrors(recursiveError(validationErrors));
        return;
      }
      let imageKey = null;
      if (userToUpdate?.image?.file) {
        const compressedImage = await imageCompression(
          userToUpdate.image.file,
          {
            maxSizeMB: 0.25,
            maxWidthOrHeight: 300,
            useWebWorker: true,
          }
        );
        const urlObj = await uploadImagesToBucket([
          {
            Key: `user/${user._id}/${compressedImage.name}`,
            file: compressedImage,
            fileType: compressedImage.type,
          },
        ]);
        imageKey = Object.values(urlObj)[0].url || user.image;
      }
      return await updateOneUser({
        newUser: {
          ...userToUpdate,
          image: imageKey,
        },
        id: user._id,
      });
    },
    onSuccess: async (data) => {
      setUserInputValue({
        name: data.name,
        email: data.email,
        address: data.address,
        image: { url: data.image },
      });
    },
  });

  useEffect(() => {
    async function asyncHandler() {
      let imageFile = null;
      try {
        const Key = getS3KeyFromUrl(user.image);
        const signedUrl = await getImageFromBucket({
          Key,
        });
        const file = await urlToFile(signedUrl);
        imageFile = addPreviewToImage(file);
      } catch (error) {
        console.log(error);
      } finally {
        setUserInputValue({
          name: user.name,
          email: user.email,
          address: user.address,
          image: {
            url: user.image,
            file: imageFile,
          },
        });
        setLoading(false);
      }
    }
    asyncHandler();
  }, []);

  if (loading) {
    return <PageLayoutSpinner />;
  }

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          mutate_user.mutate(e);
        }}
        className="w-[min(80vw,1000px)] flex flex-col gap-5 py-3 lg:py-10"
      >
        <div className="text-xl lg:text-5xl lg:pb-5">Edit Account</div>
        <AvatarChanger
          currentImage={userInputValue?.image?.url}
          onImageChange={(file) => {
            setUserInputValue({
              ...userInputValue,
              image: {
                ...userInputValue.image,
                file: file,
                url: URL.createObjectURL(file),
              },
            });
          }}
        />
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
          <Input
            isDisabled={mutate_user.isPending}
            type="text"
            label="Name"
            name="name"
            onValueChange={(value) =>
              setUserInputValue({ ...userInputValue, name: value })
            }
            value={userInputValue.name}
            isRequired
          />
          <Input
            isDisabled={mutate_user.isPending}
            type="email"
            label="Email"
            name="email"
            onValueChange={(value) =>
              setUserInputValue({ ...userInputValue, email: value })
            }
            value={userInputValue.email}
            isRequired
          />
        </div>
        <Button
          isLoading={mutate_user.isPending}
          variant="flat"
          className="px-10 py-7 text-md"
          color="primary"
          type="submit"
        >
          {editId ? "Update" : "Save"} Profile
        </Button>
        {errors.map((err, i) => (
          <span key={i} className="text-red-500">
            {err}
          </span>
        ))}
        {mutate_user.error && (
          <span className="text-red-500">{parseError(mutate_user.error)}</span>
        )}
      </form>
    </div>
  );
}

export default AccountEditPage;
