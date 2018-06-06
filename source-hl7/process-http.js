const request = require('superagent');
const winston = require('winston');
const express = require('express');

const mockHl7SourceFactory = require('./mock-hl7-source-factory');

const COHORT_SIZE = parseInt(process.env.COHORT_SIZE || 100);
const FREQUENCY = parseInt(process.env.FREQUENCY || 1000);
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || 10);
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PORT = parseInt(process.env.PORT || 3000);
const TEST_MESSAGE_SUITE = process.env.TEST_MESSAGE_SUITE || 'all';
const ENDPOINT = process.env.ENDPOINT;

winston.level = LOG_LEVEL;

if (typeof ENDPOINT === 'undefined') {
  throw new Error('Must specify a valid endpoint.');
}

const app = express();

const mockHl7Source = mockHl7SourceFactory.create({cohortSize: COHORT_SIZE, testMessageSuite: TEST_MESSAGE_SUITE});

const handleResponse = (err) => {
  if (err) {
    winston.log('warn', `ERROR: ${err}`);
  } else {
    winston.log('info', 'SUCCESS');
  }
};

let latest = 0; // Maintains state across successive requests.

setInterval(() => {
  let batch = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    batch.push(mockHl7Source.getNextMessage(latest + i));
  }

  const payload = batch.join('\n');

  winston.log('INFO', 'Sending messages.');
  winston.log('verbose', '\n' + payload);

  request.post(ENDPOINT)
      .send(payload)
      .set('accept', 'text/plain')
      .end(handleResponse);

  latest = latest + BATCH_SIZE;
}, FREQUENCY);

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => winston.log('info', `Running health check listener on port ${PORT}.`));
