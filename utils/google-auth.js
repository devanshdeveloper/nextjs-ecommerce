export async function fetchGoogleUserDetails(access_token) {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    }
  );
  return await res.json();
}