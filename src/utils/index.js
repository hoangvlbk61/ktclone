const random = (min, max) => {
  const distance = max - min;
  return Math.round(Math.random() * distance) + min;
};

module.exports = {
  random,
}