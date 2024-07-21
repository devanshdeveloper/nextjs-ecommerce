import fetchApi from "@/utils/fetchApi";

export async function createUser({ name, email, password }) {
  return await fetchApi("/api/user/create", {
    body: { name, email, password },
  });
}

export async function logInUser({ email, password }) {
  return await fetchApi("/api/user/login", {
    body: { email, password },
  });
}
export async function getUsers({ pageParam, limit, search }) {
  return await fetchApi(
    `/api/user/getall?pageParam=${pageParam}&limit=${limit}&search=${search}`,
    {
      method: "GET",
    }
  );
}

export async function getUserById({ id }) {
  return await fetchApi(`/api/user/getbyid?id=${id}`, {
    method: "GET",
  });
}

export async function updateUserById({ id, newDetails }) {
  return await fetchApi(`/api/user/update?id=${id}`, {
    method: "PUT",
    body: { id, newDetails },
  });
}

export async function addToCart({ userId, productId, quantity }) {
  return await fetchApi(
    `/api/user/addToCart?userId=${userId}&productId=${productId}&quantity=${quantity}`,
    {
      method: "POST",
    }
  );
}
export async function deleteUserById({ id }) {
  return await fetchApi(`/api/user/deletebyid?id=${id}`, {
    method: "DELETE",
  });
}

export async function searchUser({ search }) {
  return await fetchApi(`/api/user/search?search=${search}`, {
    method: "GET",
  });
}
