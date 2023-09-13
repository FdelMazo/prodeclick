const msInDay = 24 * 60 * 60 * 1000;
const days = (n) => n * msInDay;

const ELECTIONS = new Date("2023-10-22T00:00:00.000-03:00");
const BIDDING = new Date("2023-10-21T00:00:00.000-03:00");

export const daysUntilElections = () => {
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
