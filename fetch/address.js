import fetchApi from "@/utils/fetchApi";

export async function createOneAddress(body) {
  return await fetchApi("/api/address/create-one", {
    body,
  });
}

export async function readOneAddress({ id }) {
  return await fetchApi(`/api/address/read-one?id=${id}`, {
    method: "GET",
  });
}


export async function readByUserIdAddress({ userId }) {
  return await fetchApi(`/api/address/read-by-user-id?userId=${userId}`, {
    method: "GET",
  });
}

export async function updateOneAddress({ id, newAddress }) {
  return await fetchApi(`/api/address/update-one?id=${id}`, {
    method: "PUT",
    body: { id, newAddress },
  });
}

export async function deleteOneAddress({ id }) {
  return await fetchApi(`/api/address/delete-one?id=${id}`, {
    method: "DELETE",
    body: { id },
  });
}

export async function readAllAddress({ pageParam, limit, search }) {
  return await fetchApi(
    `/api/address/read-all?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
}
