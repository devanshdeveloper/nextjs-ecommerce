import fetchApi from "@/utils/fetchApi";

export async function createProduct(body) {
  return await fetchApi("/api/product/create", {
    body,
  });
}
export async function getProducts({ pageParam, limit, search }) {
  return await fetchApi(
    `/api/product/get?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
}

export async function getProductsByCategory({
  pageParam,
  limit,
  categoryId,
  search,
}) {
  return await fetchApi(
    `/api/product/getbycategory?pageParam=${pageParam}&limit=${limit}&categoryId=${categoryId}&search=${search}`,
    {
      method: "GET",
    }
  );
}
export async function getProductsByIds({ pageParam, limit, productIds }) {
  return await fetchApi(
    `/api/product/getbyids?pageParam=${pageParam}&limit=${limit}`,
    {
      body: { productIds },
      method: "POST",
    }
  );
}

export async function editProduct({ id, newDetails }) {
  return await fetchApi(`/api/product/edit?id=${id}`, {
    method: "PUT",
    body: { id, newDetails },
  });
}
export async function deleteProduct({ id }) {
  return await fetchApi(`/api/product/delete?id=${id}`, {
    method: "DELETE",
    body: { id },
  });
}
