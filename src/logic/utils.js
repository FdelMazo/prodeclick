import { customAlphabet } from "nanoid";
const crypto = require("crypto");

export const sum = (prode) => {
  return Object.values(prode)
    .reduce((a, b) => (a || 0) + (b || 0), 0)
    .toFixed(1);
};

export const diff = (prode, results) => {
  return Object.fromEntries(
    Object.entries(prode).map(([partidoId, porcentaje]) => {
      const diff = Math.abs((porcentaje - results[partidoId]).toFixed(1));
      return [partidoId, diff];
    })
  );
};

export const validProde = (prode) => {
  return sum(prode) == 100.0;
};

export const rankUsers = (partyusers, results, declareWinners = false) => {
  if (!partyusers)
    return {
      users: [],
      winners: [],
    };

  const users = partyusers
    .map((u) => ({
      dif: sum(diff(u.prode, results)),
      ...u,
    }))
    .sort((a, b) => a.dif - b.dif)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const winners = declareWinners
    ? users?.filter((u) => u.dif === users[0].dif).map((u) => u.id)
    : [];

  return { users, winners };
};

export const hash = (pw) => {
  const h = crypto.createHash("sha256");
  h.update(pw);
  return h.digest("hex");
};

export const createid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  8
);
