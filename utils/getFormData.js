export default function getFormData(e, ...keys) {
  const formData = new FormData(e.target);
  const data = {};

  keys.forEach((key) => {
    data[key] = formData.get(key);
  });

  return data;
}
