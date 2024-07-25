export function defaultProductFormValue() {
  return {
    name: "",
    description: "",
    price: 0,
    actualPrice: 0,
    images: [],
    category: { id: "", name: "" },
    variants: [],
  };
}

export function defaultCheckoutFormValue() {
  return {};
}
