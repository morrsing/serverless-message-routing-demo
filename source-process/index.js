const request = require('superagent');
const winston = require('winston');
const express = require('express');

const app = express();

const { generateMessageBatch } = require('./message-generator');

const FREQUENCY = parseInt(process.env.FREQUENCY || 1000); // 1 second
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || 10);
const PORT = parseInt(process.env.PORT || 3000);

const { ENDPOINT } = process.env;

winston.level = LOG_LEVEL;

let latest = 0;

if (typeof ENDPOINT === 'undefined') {
  throw new Error('Must specify a valid endpoint.');
}

const handleResponse = (err) => {
  if (err) {
    winston.log('warn', `ERROR: ${err}`);
  } else {
    winston.log('info', 'SUCCESS');
  }
};

const pushMessages = () => {
  const batch = generateMessageBatch(latest, BATCH_SIZE);

  request.post(ENDPOINT)
    .send(batch)
    .set('accept', 'json')
    .end(handleResponse);

  batch.forEach((record) => {
    winston.log('verbose', record);
  });

  latest += batch.length;
};

setInterval(pushMessages, FREQUENCY);

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => winston.log('info', `Running health check listener on port ${PORT}.`));

