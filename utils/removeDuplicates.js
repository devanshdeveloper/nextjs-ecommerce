function removeDuplicates(arr) {
  if (!Array.isArray(arr)) return arr;
  const uniqueArr = [...new Set(arr)];
  return uniqueArr;
}

export default removeDuplicates;
