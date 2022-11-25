const { nextISSTimesForMyLocation } = require('./issPromised');
const { printPassTimes } = require('./index');

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log(error.message);
  });
