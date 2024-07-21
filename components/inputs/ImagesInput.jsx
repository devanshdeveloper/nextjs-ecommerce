import { parseImages } from "@/utils/parseImages";
import React from "react";
import { BsImage } from "react-icons/bs";

{
  /* <Input
isDisabled={mutateCreateProduct.isPending}
className="w-[300px]"
label="Images"
name="images"
onValueChange={(value) =>
  setProductInputValue({ ...productInputValue, images: value })
}
value={productInputValue.images}
type="file"
accept="image/gif, image/jpeg, image/jpg, image/png"
multiple
/> */
}

function ImagesInput({ onValueChanges, ...props }) {
  return (
    <div className="relative h-24 w-44 cursor-pointer overflow-hidden rounded-lg border border-dashed border-foreground-400 transition-all hover:border-foreground-200">
      <div className="flex items-center justify-center">
        <BsImage className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform text-2xl text-foreground-400" />
        <input
          {...props}
          type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png"
          multiple
          className="absolute inset-0 z-10 opacity-0"
          onChange={(e) => {
            onValueChanges(e.target.files);
          }}
        />
      </div>
    </div>
  );
}

export default ImagesInput;
