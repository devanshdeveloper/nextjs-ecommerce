function parseAmount(amount) {
  if (isNaN(amount)) {
    return "0";
  }
  return `Rs ${Number(amount).toLocaleString()}`;
}
export default parseAmount;
