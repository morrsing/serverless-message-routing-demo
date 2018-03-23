const express = require('express');
const winston = require('winston');

const { generateMessageBatch } = require('./message-generator');

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || 10);
const PORT = process.env.PORT || 3000;

const app = express();

let latest = 0; // Maintains state across successive requests.

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/messages', (req, res) => {
  const batch = generateMessageBatch(latest, BATCH_SIZE);
  res.json(batch);
  batch.forEach((record) => {
    winston.log('info', record);
  });
  latest += batch.length; // Update state.
});

app.listen(PORT, () => winston.log('info', `Running on port ${PORT}. Batch size: ${BATCH_SIZE}`));
