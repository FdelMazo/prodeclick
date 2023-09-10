export const fetcher = async (url, options) =>
  fetch(url, options).then((res) => res.json());
export const GET = async (url, options) =>
  fetcher(url, { method: "GET", ...options });
export const POST = async (url, options) =>
  fetcher(url, { method: "POST", ...options });
export const PUT = async (url, options) =>
  fetcher(url, { method: "PUT", ...options });

export const createParty = async () => {
  return POST("/api/party");
};

export const initParty = async (partyId, name, adminUserId) => {
  await PUT(`/api/party/${partyId}`, {
    body: JSON.stringify({
      name,
      admin: adminUserId,
    }),
  });
};

export const createUser = async (partyId, name, password, prode) => {
  return POST(`/api/user`, {
    body: JSON.stringify({
      partyId,
      name,
      password,
      prode,
    }),
  });
};

export const checkUser = async (partyId, name, password) => {
  return PUT(`/api/login/${partyId}`, {
    body: JSON.stringify({
      name,
      password,
    }),
  });
};

export const updateUserProde = async (userId, prode) => {
  await PUT(`/api/user/${userId}`, {
    body: JSON.stringify({
      prode,
    }),
  });
};
