const secInDay = 86400
const daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const getDayFromTimestamp = timestamp => (new Date(timestamp * 1000).getDay() + 6) % 7
const timestampToHr = t => {
  const hrs = Math.floor(t / (secInDay / 24))
  let min = Math.floor((t % 3600) / 60)
  if (min < 10) { min = `${min}0` }
  return `${hrs}:${min}`
}

module.exports = {
  secInDay,
  daysInWeek,
  getDayFromTimestamp,
  timestampToHr
}
