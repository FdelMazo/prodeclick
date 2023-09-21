const fetcher = async (url, options) =>
  fetch(url, options).then((res) => res.json());
export const GET = async (url, options) =>
  fetcher(url, { method: "GET", ...options });
export const POST = async (url, options) =>
  fetcher(url, { method: "POST", ...options });
export const PUT = async (url, options) =>
  fetcher(url, { method: "PUT", ...options });
export const DELETE = async (url, options) =>
  fetcher(url, { method: "DELETE", ...options });

// PARTY CRUD

export const createParty = async () => {
  return POST("/api/party");
};

export const getParty = async (partyId) => {
  return GET(`/api/party/${partyId}`);
};

export const updateParty = async (partyId, data) => {
  return PUT(`/api/party/${partyId}`, {
    body: JSON.stringify(data),
  });
};

// USER CRUD

export const createUser = async (data) => {
  return POST("/api/user", {
    body: JSON.stringify(data),
  });
};

export const updateUser = async (userId, data) => {
  return PUT(`/api/user/${userId}`, {
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (partyId, userId) => {
  return DELETE(`/api/user/${userId}`, {
    body: JSON.stringify({
      partyId,
    }),
  });
};

// LOGIN

export const checkUser = async (partyId, name, password) => {
  return PUT(`/api/login/${partyId}`, {
    body: JSON.stringify({
      name,
      password,
    }),
  });
};
