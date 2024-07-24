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
import { IoRemoveCircle } from "react-icons/io5";

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
    <div className="flex flex-col items-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          mutateCreateProduct.mutate(e);
        }}
        className="w-[min(80vw,1000px)] flex flex-col gap-5 py-3 lg:py-10"
      >
        <div className="text-xl lg:text-5xl  lg:pb-5">Create Product</div>
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
          <Textarea
            isDisabled={mutateCreateProduct.isPending}
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
            isDisabled={mutateCreateProduct.isPending}
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
            isDisabled={mutateCreateProduct.isPending}
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
            isDisabled={mutateCreateProduct.isPending}
            type="number"
            label="Actual Price"
            name="actualPrice"
            onValueChange={(value) =>
              setProductInputValue({ ...productInputValue, actualPrice: value })
            }
            value={productInputValue.actualPrice}
            isRequired
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ImagesInput
              required
              onValueChanges={(values) => {
                setProductInputValue({
                  ...productInputValue,
                  images: [...values],
                });
              }}
              />
            {parseImages(productInputValue.images).map((image) => {
              return (
                <div
                key={image.filename}
                className="relative flex flex-col gap-5"
                >
                  <Image
                    src={image.image}
                    alt=""
                    className="w-full"
                    width={100}
                    height={100}
                    />
                  <Button
                    className="absolute left-5 top-5"
                    isIconOnly
                    size="sm"
                    onPress={() =>
                      setProductInputValue({
                        ...productInputValue,
                        images: productInputValue.images.filter(
                          (i) => i.name !== image.filename
                        ),
                      })
                    }
                    >
                    <IoRemoveCircle />
                  </Button>
                </div>
              );
            })}
          </div>
        <AsyncAutoCompete
          isRequired
          queryKey="categories"
          queryFn={(params) => readAllCategory({ ...params, limit: 10 })}
          value={productInputValue.category}
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
    </div>
  );
}

export default CreateProductPage;
