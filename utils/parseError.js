export default function parseError(error) {
  if (!error) return;
  console.log(error);
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((value) => value.message);
    return message;
  }
  return !!error.error ? error.error : null;
}

export function recursiveError(errors, path = "") {
  let result = [];

  for (let key in errors) {
    if (key === "_errors" && errors[key].length > 0) {
      // Append the current path and the error messages
      errors[key].forEach((error) => {
        result.push(`${path}: ${error}`);
      });
    } else if (typeof errors[key] === "object" && errors[key] !== null) {
      // Recurse into the object
      let newPath = path ? `${path}.${key}` : key;
      result = result.concat(recursiveError(errors[key], newPath));
    }
  }

  return result;
}
