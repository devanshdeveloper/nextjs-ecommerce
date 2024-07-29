import { Button, Input } from "@nextui-org/react";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { MdCancelPresentation } from "react-icons/md";

export default function VariantInput({ variants, setVariants, isRequired }) {
  const handleVariantChange = (index, event) => {
    const newVariants = [...variants];
    newVariants[index][event.target.name] = event.target.value;
    setVariants(newVariants);
  };

  const handleOptionChange = (variantIndex, optionIndex, event) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options[optionIndex] = event.target.value;
    setVariants(newVariants);
  };

  const addVariant = (newVariant = { name: "", options: [""] , inventory : ""}) => {
    setVariants([...variants, newVariant]);
  };
  const deleteVariant = (variantIndex) => {
    setVariants([...variants.filter((_, index) => index !== variantIndex)]);
  };

  const addOption = (variantIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push("");
    setVariants(newVariants);
  };
  const deleteOption = (variantIndex, optionIndex) => {
    setVariants([
      ...variants.map((variant, index) => {
        if (variantIndex === index) {
          return {
            ...variant,
            options: variant.options.filter(
              (_, index) => index !== optionIndex
            ),
          };
        }
        return variant;
      }),
    ]);
  };

  return (
    <div className="flex flex-col justify-start items-start gap-5">
      {variants.map((variant, variantIndex) => (
        <div className="flex flex-col gap-5" key={variantIndex}>
          <Input
            label="Variant Name:"
            type="text"
            name="name"
            isRequired={isRequired}
            value={variant.name}
            onChange={(event) => handleVariantChange(variantIndex, event)}
            endContent={
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  color="gray"
                  className="flex items-center justify-center"
                  onPress={() => deleteVariant(variantIndex)}
                >
                  <CircleX />
                </Button>
              </div>
            }
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-5">
            {variant.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <Input
                  label="Option:"
                  type="text"
                  name="name"
                  value={option}
                  isRequired={isRequired}
                  onChange={(event) =>
                    handleOptionChange(variantIndex, optionIndex, event)
                  }
                  required
                  endContent={
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        color="gray"
                        className="flex items-center justify-center"
                        onPress={() => deleteOption(variantIndex, optionIndex)}
                      >
                        <CircleX />
                      </Button>
                    </div>
                  }
                />
              </div>
            ))}
            <Button
              variant="flat"
              color="primary"
              onPress={() => addOption(variantIndex)}
            >
              Add Option
            </Button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <Button
          variant="flat"
          color="primary"
          onPress={() =>
            addVariant({ name: "Size", options: ["S", "M", "L", "XL"] })
          }
        >
          Add Size Variant
        </Button>
        <Button
          variant="flat"
          color="primary"
          onPress={() =>
            addVariant({
              name: "Size",
              options: ["#1feeee", "#ffffff", "#000000", "#fff000"],
            })
          }
        >
          Add Color Variant
        </Button>
        <Button variant="flat" color="primary" onPress={() => addVariant()}>
          Add Custom Variant
        </Button>
      </div>
    </div>
  );
}
