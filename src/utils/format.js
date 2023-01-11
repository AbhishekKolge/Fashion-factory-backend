const removeQuotes = (str) => {
  return str.replace(/['"]+/g, "");
};

const currentTime = () => {
  return new Date();
};

const checkTimeExpired = (timeArg) => {
  const minute = 60000;
  return new Date(timeArg).getTime() - minute < Date.now();
};

const time = (timeArg) => {
  return new Date(timeArg);
};

module.exports = { removeQuotes, currentTime, checkTimeExpired, time };
