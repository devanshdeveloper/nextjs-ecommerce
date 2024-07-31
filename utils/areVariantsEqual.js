

export function areVariantsEqual(obj1, obj2) {
  const tempObj = {};
  for (const item of obj1) {
    if (item.name && item.value) {
      tempObj[item.name] = item.value;
    }
  }
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (tempObj[key] !== obj2[key]) {
        return false; // Values do not match
      }
    }
  }
  for (const key in tempObj) {
    if (tempObj.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}