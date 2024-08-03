export function getProductsCountMessage(productsCount) {
  if (productsCount) {
    return `Showing ${productsCount} product${productsCount === 1 ? "" : "s"}`;
  } else {
    return "No products found";
  }
}
