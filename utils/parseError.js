export default function parseError(error) {
  if (!error) return;
  console.log(error);
  return !!error.error ? error.error: null;
}
