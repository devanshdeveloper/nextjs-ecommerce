export default async function fetchApi(url, options) {
  const requestOptions = { ...options };
  if (requestOptions.body) {
    requestOptions.method = requestOptions.method || "POST";
    requestOptions.headers = { ...requestOptions.headers };
    requestOptions.headers["Content-Type"] = "application/json";
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
}
