const ELECTIONS = new Date("2023-10-22T00:00:00.000-03:00");

// Se puede apostar "hasta el viernes". O sea, hasta las 00:00 del sábado.
const BIDDING = new Date("2023-10-21T00:00:00.000-03:00");

export const canBid = () => {
  const today = new Date();
  return today < BIDDING;
};

export const daysUntilElections = () => {
  const msInDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const diffTime = ELECTIONS - today;
  return Math.ceil(diffTime / msInDay);
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
