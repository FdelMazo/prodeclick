import ELECCIONES_DATA from "./elecciones";
const ELECCIONES = ELECCIONES_DATA.elecciones[ELECCIONES_DATA.current];
const crypto = require("crypto");

export const canBid = () => {
  const today = new Date();
  return today < new Date(ELECCIONES.bidding);
};

export const daysUntilElections = () => {
  const elections = new Date(ELECCIONES.date);
  const msInDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const diffTime = elections - today;
  return Math.ceil(diffTime / msInDay);
};

export const isElectionsDay = () => {
  return new Date() >= new Date(ELECCIONES.date);
};

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
