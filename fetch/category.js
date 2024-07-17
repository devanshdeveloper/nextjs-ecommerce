import fetchApi from "@/utils/fetchApi";

export async function createCategory({ name }) {
  return await fetchApi("/api/category/create", {
    body: { name },
  });
}
export async function getCategories({ pageParam, limit, search }) {
  return await fetchApi(
    `/api/category/getall?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
}

export async function editCategory({ id, newDetails }) {
  return await fetchApi(`/api/category/edit?id=${id}`, {
    method: "PUT",
    body: { id, newDetails },
  });
}
export async function deleteCategory({ id }) {
  return await fetchApi(`/api/category/delete?id=${id}`, {
    method: "DELETE",
    body: { id },
  });
}
