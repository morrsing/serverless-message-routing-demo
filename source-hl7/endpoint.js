const express = require('express');
const winston = require('winston');

const mockHl7SourceFactory = require('./mock-hl7-source-factory');

const COHORT_SIZE = 100;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || 10);
const PORT = process.env.PORT || 3000;
const TEST_MESSAGE_SUITE = process.env.TEST_MESSAGE_SUITE || 'all';

const app = express();

const mockHl7Source = mockHl7SourceFactory.create({cohortSize: COHORT_SIZE, testMessageSuite: TEST_MESSAGE_SUITE});

let latest = 0; // Maintains state across successive requests.

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/messages', (req, res) => {
  winston.log('info', 'Messages requested.');

  let batch = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    batch.push(mockHl7Source.getNextMessage(latest + i));
  }

  latest = latest + BATCH_SIZE;

  const payload = batch.join('\n');

  winston.log('verbose', 'Sending messages:\n' + payload);

  res.send(payload);
});

app.listen(PORT, () => winston.log('info', `Running health check listener on port ${PORT}.`));

