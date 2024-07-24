import fetchApi from "@/utils/fetchApi";

export async function createOneCategory({ name }) {
  return await fetchApi("/api/category/create-one", {
    body: { name },
  });
}

export async function readOneCategory({ id }) {
  return await fetchApi(`/api/category/read-one?id=${id}`, {
    method: "GET",
  });
}

export async function updateOneCategory({ id, newCategory }) {
  return await fetchApi(`/api/category/update-one?id=${id}`, {
    method: "PUT",
    body: { id, newCategory },
  });
}

export async function deleteOneCategory({ id }) {
  return await fetchApi(`/api/category/delete-one?id=${id}`, {
    method: "DELETE",
    body: { id },
  });
}

export async function readAllCategory({ pageParam, limit, search }) {
  return await fetchApi(
    `/api/category/read-all?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
}

export async function readByNameCategory({ name }) {
  return await fetchApi(`/api/category/read-by-name?name=${name}`, {
    method: "GET",
  });
}

export async function addToFavoritesCategory({ id, favorite }) {
  return await fetchApi(`/api/category/add-to-favorites`, {
    method: "PUT",
    body: { id, favorite },
  });
}
