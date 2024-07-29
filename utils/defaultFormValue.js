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
  return {
    street: "123 Elm Street",
    city: "Springfield",
    state: "IL",
    phoneNo: "5551234567",
    zipCode: "62701",
    country: "USA",
  };
}
