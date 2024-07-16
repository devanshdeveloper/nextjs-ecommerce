export default function parseError(error) {
  if (!error) return;
  console.log(error);
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((value) => value.message);
    return message;
  }
  return !!error.error ? error.error : null;
}
