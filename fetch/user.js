import fetchApi from "@/utils/fetchApi";

export async function createOneUser({ name, email, password }) {
  return await fetchApi("/api/user/create-one", {
    body: { name, email, password },
  });
}

export async function logInUser({ email, password }) {
  return await fetchApi("/api/user/login", {
    body: { email, password },
  });
}

export async function readAllUsers({ pageParam, limit, search }) {
  return await fetchApi(
    `/api/user/read-all?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
}

export async function readOneUser({ id }) {
  return await fetchApi(`/api/user/read-one?id=${id}`, {
    method: "GET",
  });
}

export async function updateOneUser({ id, newUser }) {
  return await fetchApi(`/api/user/update-one?id=${id}`, {
    method: "PUT",
    body: { id, newUser },
  });
}

export async function addToCart({ userId, productId, quantity }) {
  return await fetchApi(
    `/api/user/add-to-cart?userId=${userId}&productId=${productId}&quantity=${quantity}`,
    {
      method: "POST",
    }
  );
}

export async function deleteOneUser({ id }) {
  return await fetchApi(`/api/user/delete-one?id=${id}`, {
    method: "DELETE",
  });
}
