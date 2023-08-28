const msInDay = 24 * 60 * 60 * 1000
const days = (n) => n * msInDay

const ELECTIONS = new Date("2023-10-22T00:00:00.000-03:00")
const BIDDING = ELECTIONS - days(2)
