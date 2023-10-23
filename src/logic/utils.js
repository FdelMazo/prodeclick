import { customAlphabet } from "nanoid";
const crypto = require("crypto");

export const sum = (prode) => {
  return Object.values(prode)
    .reduce((a, b) => (a || 0) + (b || 0), 0)
    .toFixed(1);
};

export const validProde = (prode) => {
  return sum(prode) == 100.0;
};

export const diff = (prode, results) => {
  return Object.fromEntries(
    Object.entries(prode).map(([partidoId, porcentaje]) => {
      const diff = Math.abs((porcentaje - results[partidoId]).toFixed(1));
      return [partidoId, diff];
    })
  );
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
