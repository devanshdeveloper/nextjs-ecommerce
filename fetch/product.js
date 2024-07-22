import fetchApi from "@/utils/fetchApi";

export async function createOneProduct(body) {
  return await fetchApi("/api/product/create-one", {
    body,
  });
}

export async function readOneProduct({ id }) {
  return await fetchApi(`/api/product/read-one?id=${id}`, {
    method: "GET",
  });
}

export async function updateOneProduct({ id, newProduct }) {
  return await fetchApi(`/api/product/updateOne?id=${id}`, {
    method: "PUT",
    body: { id, newProduct },
  });
}

export async function deleteOneProduct({ id }) {
  return await fetchApi(`/api/product/delete-one?id=${id}`, {
    method: "DELETE",
    body: { id },
  });
}

export async function readAllProducts({ pageParam, limit, search }) {
  return await fetchApi(
    `/api/product/read-all?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
}

export async function readProductsByIds({ pageParam, limit, productIds }) {
  return await fetchApi(
    `/api/product/read-by-ids?pageParam=${pageParam}&limit=${limit}`,
    {
      body: { productIds },
      method: "POST",
    }
  );
}

export async function readProductsByCategoryId({
  pageParam,
  limit,
  categoryId,
  search,
}) {
  return await fetchApi(
    `/api/product/read-by-category-id?pageParam=${pageParam}&limit=${limit}&categoryId=${categoryId}&search=${search}`,
    {
      method: "POST",
      body: {},
    }
  );
}

export async function feedProducts() {
  return await fetchApi(`/api/product/feed-products`, {
    method: "GET",
  });
}
