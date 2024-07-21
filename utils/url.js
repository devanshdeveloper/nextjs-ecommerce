export default function url(url) {
  const newURL = new URL(url);
  const searchParams = newURL.searchParams;
  return {
    ...newURL,
    searchParams: {
      ...searchParams,
      getAll(...keys) {
        return keys.map((key) => searchParams.get(key));
      },
    },
  };
}
