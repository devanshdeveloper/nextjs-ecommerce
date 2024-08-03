"use client";

// UI COMPONENTS
import AsyncAutoCompete from "@/components/inputs/AsyncAutoComplete";
import { Button, Input, Textarea } from "@nextui-org/react";
import VariantInput from "@/components/inputs/VariantInput";

// UTILS
import {
  createOneProduct,
  readOneProduct,
  updateOneProduct,
} from "@/fetch/product";
import { readAllCategory } from "@/fetch/category";
import {
  getImageFromBucket,
  uploadImagesToBucket,
} from "@/utils/s3-bucket-front";
import { v4 } from "uuid";
import { defaultProductFormValue } from "@/utils/defaultFormValue";
import parseError, { recursiveError } from "@/utils/parseError";

// HOOKS
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ImageUploader from "@/components/inputs/ImageUploaderInput";
import imageCompression from "browser-image-compression";
import { validateProductForm } from "@/utils/formValidation";
import addPreviewToImage from "@/utils/addPreviewToImage";
import { getS3KeyFromUrl, urlToFile } from "@/utils/urlsToFiles";
import { useRouter } from "next/navigation";
import PageLayoutSpinner from "../spinners/PageLayoutSpinner";
import PageLayout from "../layout/PageLayout";
function ProductForm({ editId }) {
  const router = useRouter();
  const [productInputValue, setProductInputValue] = useState(
    defaultProductFormValue()
  );
  const {
    data: product,
    error: productQueryError,
    isPending,
  } = useQuery({
    queryKey: ["product", editId],
    queryFn: async () => {
      const product = await readOneProduct({ id: editId });
      const images = await Promise.all(
        product.images.map(async (url) => {
          const signedUrl = await getImageFromBucket({
            Key: getS3KeyFromUrl(url),
          });
          return addPreviewToImage(await urlToFile(signedUrl));
        })
      );

      setProductInputValue({
        name: product.name,
        description: product.description,
        price: product.price,
        actualPrice: product.actualPrice,
        images,
        category: { id: product.category._id, name: product.category.name },
        variants: product.variants,
      });
      return product;
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!editId,
    onSuccess(data) {
      console.log(data);
    },
  });
  console.log(productQueryError);

  const [errors, setErrors] = useState([]);

  const mutate_product = useMutation({
    mutationFn: async () => {
      const productToUpload = {
        ...productInputValue,
        actualPrice: parseInt(productInputValue.actualPrice),
        price: parseInt(productInputValue.price),
      };
      const validationErrors = validateProductForm(productToUpload);
      if (validationErrors) {
        setErrors(recursiveError(validationErrors));
        return;
      }
      const uuid = editId ?? v4().replace(/-/g, "").substring(0, 24);
      const compressedFiles = await Promise.all(
        productToUpload.images.map((image) => {
          return imageCompression(image, {
            maxSizeMB: 0.25,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
        })
      );
      const urlObj = await uploadImagesToBucket(
        compressedFiles.map((image) => ({
          Key: `product/${productToUpload.category.name}/${image.name}`,
          file: image,
          fileType: image.type,
        }))
      );
      const imageKeys = Object.keys(urlObj);
      return await (editId ? updateOneProduct : createOneProduct)({
        ...productToUpload,
        images: imageKeys,
        _id: uuid,
      });
    },
    onSuccess: (data) => {
      setProductInputValue(defaultProductFormValue());
      router.push(`/admin/products/${data._id}/details`);
    },
  });

  if (isPending) {
    return <PageLayoutSpinner />;
  }

  if (productQueryError) {
    return (
      <PageLayout className={"flex flex-col gap-10"}>
        <h1>An error occurred while fetching products.</h1>
        <p>{productQueryError.message}</p>
        <p>Please try again later.</p>
      </PageLayout>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          mutate_product.mutate(e);
        }}
        className="w-[min(80vw,1000px)] flex flex-col gap-5 py-3 lg:py-10"
      >
        <div className="text-xl lg:text-5xl  lg:pb-5">
          {editId ? "Edit" : "Create"} Product
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
          <Textarea
            isDisabled={mutate_product.isPending}
            type="text"
            label="Product"
            name="Product"
            onValueChange={(value) =>
              setProductInputValue({ ...productInputValue, name: value })
            }
            value={productInputValue.name}
            isRequired
          />
          <Textarea
            isDisabled={mutate_product.isPending}
            type="text"
            label="Description"
            name="description"
            onValueChange={(value) =>
              setProductInputValue({ ...productInputValue, description: value })
            }
            value={productInputValue.description}
            isRequired
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
          <Input
            isDisabled={mutate_product.isPending}
            type="number"
            label="Price"
            name="price"
            onValueChange={(value) =>
              setProductInputValue({ ...productInputValue, price: value })
            }
            value={productInputValue.price}
            isRequired
          />
          <Input
            isDisabled={mutate_product.isPending}
            type="number"
            label="Actual Price"
            name="actualPrice"
            onValueChange={(value) =>
              setProductInputValue({
                ...productInputValue,
                actualPrice: value,
              })
            }
            value={productInputValue.actualPrice}
            isRequired
          />
        </div>
        <ImageUploader
          acceptedImages={productInputValue.images}
          setAcceptedImages={(value) => {
            setProductInputValue((prev) => ({
              ...prev,
              images: [
                ...(typeof value === "function" ? value(prev.images) : value),
              ],
            }));
          }}
        />
        <AsyncAutoCompete
          isRequired
          queryKey="categories"
          queryFn={(params) => readAllCategory({ ...params, limit: 10 })}
          value={productInputValue.category.name}
          setValue={(value) =>
            setProductInputValue({ ...productInputValue, category: value })
          }
        />
        <VariantInput
          isRequired
          variants={productInputValue.variants}
          setVariants={(variants) =>
            setProductInputValue({ ...productInputValue, variants })
          }
        />
        <Button
          isLoading={mutate_product.isPending}
          variant="flat"
          className="px-10 py-7 text-md"
          color="primary"
          type="submit"
        >
          {editId ? "Edit" : "Add"} Product
        </Button>
        {errors.map((err, i) => (
          <span key={i} className="text-red-500">
            {err}
          </span>
        ))}
        {mutate_product.error && (
          <span className="text-red-500">
            {parseError(mutate_product.error)}
          </span>
        )}
      </form>
    </div>
  );
}

export default ProductForm;
