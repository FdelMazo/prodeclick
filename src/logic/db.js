import { kv } from "@vercel/kv";
import { customAlphabet } from "nanoid";
const id = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);
const crypto = require("crypto");

export const create = async (key, value) => {
  const newId = id();
  await kv.hset(`${key}:${newId}`, value);
  return newId;
};

export const getAll = async (key) => {
  return (await kv.scan(0, { match: `${key}:*`, count: 10000 }))[1];
};

export const getN = async (key) => {
  return (await getAll(key)).length;
};

export const getParty = async (partyId) => {
  const party = await kv.hgetall(`party:${partyId}`);
  const users =
    party?.users?.length > 0
      ? await Promise.all(party.users.map((u) => u.split(":")[1]).map(getUser))
      : [];
  return {
    id: partyId,
    ...party,
    users,
    admin: party?.admin ? await getUser(party.admin) : null,
  };
};

export const getUser = async (userId) => {
  const keys = await kv.hkeys(`user:${userId}`);
  const user = { id: userId };
  for (const key of keys) {
    if (key === "password") {
      continue;
    }
    user[key] = await kv.hget(`user:${userId}`, key);
  }
  return user;
};

export const createUser = async (partyId, values) => {
  const { name, password, prode } = values;
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const hashedPassword = hash.digest("hex");

  const userId = await create("user", {
    name: name.trim(),
    password: hashedPassword,
    prode,
  });
  const users = await kv.hget(`party:${partyId}`, "users");
  await kv.hset(`party:${partyId}`, { users: [...users, `user:${userId}`] });
  return userId;
};

export const checkUser = async (partyId, userName, userPassword) => {
  const party = await getParty(partyId);
  const user = party.users.find(
    (u) => u.name.trim().toLowerCase() === userName.trim().toLowerCase()
  );
  // if the user doesn't exist, we can create it
  if (!user) {
    return { create: true };
  }
  const hash = crypto.createHash("sha256");
  hash.update(userPassword);
  const hashedPassword = hash.digest("hex");
  const currentPassword = await kv.hget(`user:${user.id}`, "password");
  if (hashedPassword !== currentPassword) {
    // if the user exists, but the password is wrong, we error out
    return { wrongPassword: true };
  }

  // if the user exists and the password is correct, we return the userId
  return { userId: user.id };
};

export const createParty = async (partyId, values) => {
  return create("party", { users: [] });
};

export const updateUserProde = async (userId, prode) => {
  return kv.hset(`user:${userId}`, { prode });
};

export const updateParty = async (partyId, name, admin) => {
  return kv.hset(`party:${partyId}`, {
    name: name.trim(),
    admin,
  });
};
