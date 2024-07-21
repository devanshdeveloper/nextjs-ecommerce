//   name: {
//     type: String,
//     required: [true, "Please enter product name"],
//   },
//   description: {
//     type: String,
//     required: [true, "Please enter product description"],
//   },
//   price: {
//     type: Number,
//     required: [true, "Please enter product price"],
//   },
//   actualPrice: {
//     type: Number,
//   },
//   images: [{ type: String }],
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: [true, "Please enter product category"],
//   },
"use client";
import ImagesInput from "@/components/inputs/ImagesInput";
import AsyncAutoCompete from "@/components/inputs/AsyncAutoComplete";
import { createProduct } from "@/fetch/product";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { getCategories } from "@/fetch/category";
import {
  getImagesFromBucket,
  uploadImagesToBucket,
} from "@/utils/s3-bucket-front";
import { v4 } from "uuid";
import { parseImages } from "@/utils/parseImages";
import VariantInput from "@/components/inputs/VariantInput";
import { defaultProductFormValue } from "@/utils/defaultFormValue";
import parseError from "@/utils/parseError";
import { mockDataArray } from "@/dummy/products";

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
      return await createProduct({
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
        mutateCreateProduct.mutate(e)
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
              onClick={() =>
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
      <Button
        onPress={() => {
          uploadImagesToBucket(productInputValue.images, (image) => {
            return `product/T-Shirts/${image.name}`;
          });
        }}
      >
        Upload
      </Button>
      <Button
        onPress={async () => {
          const url = await getImagesFromBucket(
            "product/T-Shirts/Screenshot 2024-06-29 203138.png",
            "product/T-Shirts/Screenshot 2024-07-02 184033.png"
          );
        }}
      >
        get
      </Button>
      <AsyncAutoCompete
        queryKey="categories"
        queryFn={(params) => getCategories({ ...params, limit: 10 })}
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
