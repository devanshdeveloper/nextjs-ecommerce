"use client";

// UI COMPONENTS
import ImagesInput from "@/components/inputs/ImagesInput";
import AsyncAutoCompete from "@/components/inputs/AsyncAutoComplete";
import { Button, Input, Textarea } from "@nextui-org/react";
import Image from "next/image";
import VariantInput from "@/components/inputs/VariantInput";

// UTILS
import { createOneProduct } from "@/fetch/product";
import { readAllCategory } from "@/fetch/category";
import {
  getImagesFromBucket,
  uploadImagesToBucket,
} from "@/utils/s3-bucket-front";
import { v4 } from "uuid";
import { parseImages } from "@/utils/parseImages";
import { defaultProductFormValue } from "@/utils/defaultFormValue";
import parseError from "@/utils/parseError";

// HOOKS
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function CreateProductPage() {
  const [productInputValue, setProductInputValue] = useState(
    defaultProductFormValue()
  );

  const mutateCreateProduct = useMutation({
    mutationFn: async () => {
      const uuid = v4().replace(/-/g, "").substring(0, 24);
      const imageKeys = await uploadImagesToBucket(
        productInputValue.images.map((image) => ({
          Key: `product/${uuid}/${uuid}-${image.name}`,
          file: image,
          fileType: image.type,
        }))
      );
      return await createOneProduct({
        ...productInputValue,
        images: imageKeys,
        _id: uuid,
      });
    },
    onSuccess: (data) => {
      setProductInputValue(defaultProductFormValue());
    },
  });
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        mutateCreateProduct.mutate(e);
      }}
      className="w-full flex flex-col gap-2 p-10"
    >
      <Input
        isDisabled={mutateCreateProduct.isPending}
        className="w-[300px]"
        type="text"
        label="Product"
        name="Product"
        onValueChange={(value) =>
          setProductInputValue({ ...productInputValue, name: value })
        }
        value={productInputValue.name}
      />
      <Textarea
        isDisabled={mutateCreateProduct.isPending}
        className="w-[300px]"
        type="text"
        label="Description"
        name="description"
        onValueChange={(value) =>
          setProductInputValue({ ...productInputValue, description: value })
        }
        value={productInputValue.description}
      />
      <Input
        isDisabled={mutateCreateProduct.isPending}
        className="w-[300px]"
        type="number"
        label="Price"
        name="price"
        onValueChange={(value) =>
          setProductInputValue({ ...productInputValue, price: value })
        }
        value={productInputValue.price}
      />
      <Input
        isDisabled={mutateCreateProduct.isPending}
        className="w-[300px]"
        type="number"
        label="Actual Price"
        name="actualPrice"
        onValueChange={(value) =>
          setProductInputValue({ ...productInputValue, actualPrice: value })
        }
        value={productInputValue.actualPrice}
      />
      <ImagesInput
        onValueChanges={(values) => {
          setProductInputValue({ ...productInputValue, images: [...values] });
        }}
      />
      {parseImages(productInputValue.images).map((image) => {
        return (
          <div key={image.filename} className="flex gap-2">
            <Image
              src={image.image}
              alt=""
              className="w-[100px]"
              width={100}
              height={100}
            />
            <Button
              onPress={() =>
                setProductInputValue({
                  ...productInputValue,
                  images: productInputValue.images.filter(
                    (i) => i.name !== image.filename
                  ),
                })
              }
            >
              Remove
            </Button>
          </div>
        );
      })}
      <AsyncAutoCompete
        queryKey="categories"
        queryFn={(params) => readAllCategory({ ...params, limit: 10 })}
        value={productInputValue.category}
        setValue={(value) =>
          setProductInputValue({ ...productInputValue, category: value })
        }
      />
      <VariantInput
        variants={productInputValue.variants}
        setVariants={(variants) =>
          setProductInputValue({ ...productInputValue, variants })
        }
      />
      <Button
        isLoading={mutateCreateProduct.isPending}
        variant="flat"
        className="px-10 py-7 text-md"
        color="primary"
        type="submit"
      >
        Add Product
      </Button>
      {mutateCreateProduct.error && (
        <span className="text-red-500">
          {parseError(mutateCreateProduct.error)}
        </span>
      )}
    </form>
  );
}

export default CreateProductPage;
