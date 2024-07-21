import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

export default function VariantInput({ variants, setVariants }) {
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

  const addVariant = () => {
    setVariants([...variants, { name: "", options: [""] }]);
  };

  const addOption = (variantIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push("");
    setVariants(newVariants);
  };

  return (
    <div>
      {variants.map((variant, variantIndex) => (
        <div key={variantIndex}>
          <Input
            label="Variant Name:"
            type="text"
            name="name"
            value={variant.name}
            onChange={(event) => handleVariantChange(variantIndex, event)}
            required
          />

          {variant.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <Input
                label="Option:"
                type="text"
                name="name"
                value={option}
                onChange={(event) =>
                  handleOptionChange(variantIndex, optionIndex, event)
                }
                required
              />
            </div>
          ))}
          <Button
            variant="flat"
            color="primary"
            onClick={() => addOption(variantIndex)}
          >
            Add Option
          </Button>
        </div>
      ))}
      <Button variant="flat" color="primary" onClick={addVariant}>
        Add Variant
      </Button>
    </div>
  );
}
