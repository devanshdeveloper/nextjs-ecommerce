function parseAmount(amount) {
  if (isNaN(amount)) {
    return "0";
  }
  return Number(amount).toLocaleString();
}
export default parseAmount;
