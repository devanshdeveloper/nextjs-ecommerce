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
export async function getUsers({ pageParam, limit }) {
  return await fetchApi(
    `/api/user/getall?pageParam=${pageParam}&limit=${limit}`,
    {
      method: "GET",
    }
  );
}

export async function getUserById({ id }) {
  return await fetchApi(
    `/api/user/getbyid?id=${id}`,
    {
      method: "GET",
    }
  );
}

export async function deleteUserById({ id }) {
  return await fetchApi(
    `/api/user/deletebyid?id=${id}`,
    {
      method: "DELETE",
    }
  );
}
