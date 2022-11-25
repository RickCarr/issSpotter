const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(`The site ${error.hostname} is not reachable.`, null);
    }

    const data = JSON.parse(body).ip;
    callback(null, data);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}?output=json`, (error, response, body) => {
    if (error) {
      return callback(`The site ${error.hostname} is not reachable.`, null);
    }

    const data = JSON.parse(body);
    const coords = { latitude: data.latitude, longitude: data.longitude };
    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      return callback(`The site ${error.hostname} is not reachable.`, null);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status code: ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const data = JSON.parse(body).response;
    callback(null, data);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback("IP didn't work!", error);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback("Coord didn't work!", error);
        return;
      }

      fetchISSFlyOverTimes(coords, (error, response) => {
        if (error) {
          callback("Fly didn't work!", error);
          return;
        }

        callback(null, response);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };