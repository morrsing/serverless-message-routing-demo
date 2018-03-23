const request = require('superagent');
const winston = require('winston');
const express = require('express');

const app = express();

const FREQUENCY = parseInt(process.env.FREQUENCY || 1000); // 1 second
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const { ENDPOINT, METHOD } = process.env;
const { METHOD_REQUESTER_MAP } = require('./constants');
const PORT = parseInt(process.env.PORT || 3000);

winston.level = LOG_LEVEL;

if (typeof ENDPOINT === 'undefined') {
  throw new Error('Must specify a valid endpoint.');
}

if (typeof METHOD === 'undefined') {
  throw new Error('Must specify a valid HTTP method.');
}

const handleResponse = (err, res) => {
  if (err) {
    winston.log('warn', `ERROR: ${err}`);
  } else {
    winston.log('info', 'SUCCESS');
    JSON.parse(res.text).forEach((record) => {
      winston.log('verbose', record);
    });
  }
};

let timestamp = Date.now() / 1000;
setInterval(() => {
  const method = METHOD_REQUESTER_MAP[METHOD];
  request[method](ENDPOINT)
    .query({ timestamp: timestamp })
    .end(handleResponse);

  timestamp = Date.now() / 1000;
}, FREQUENCY);

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => winston.log('info', `Running health check listener on port ${PORT}.`));

