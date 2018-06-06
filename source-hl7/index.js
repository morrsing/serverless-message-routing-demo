const winston = require('winston');
const express = require('express');

const mockHl7SourceFactory = require('./mock-hl7-source-factory');

const COHORT_SIZE = parseInt(process.env.COHORT_SIZE || 100);
const FREQUENCY = parseInt(process.env.FREQUENCY || 5000);
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || 10);
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PORT = parseInt(process.env.PORT || 3000);
const TEST_MESSAGE_SUITE = process.env.TEST_MESSAGE_SUITE || 'all';

const HL7_SERVER = process.env.HL7_SERVER;
const HL7_SERVER_PORT = parseInt(process.env.HL7_SERVER_PORT || 7777);

winston.level = LOG_LEVEL;

if (typeof HL7_SERVER === 'undefined') {
  throw new Error('Must specify a valid HL7 server.');
}

const hl7 = require('simple-hl7');

var client = hl7.Server.createTcpClient(HL7_SERVER, HL7_SERVER_PORT);
const parser = new hl7.Parser({segmentSeperator: '\n'});

const app = express();

const mockHl7Source = mockHl7SourceFactory.create({cohortSize: COHORT_SIZE, testMessageSuite: TEST_MESSAGE_SUITE});

const handleResponse = (err, ack) => {
  if (err) {
    winston.log('warn', 'ERROR');
    winston.log('verbose', err);
    winston.log('warn', 'Attempting to reconnect.');
    client = hl7.Server.createTcpClient(HL7_SERVER, HL7_SERVER_PORT);
  } else {
    winston.log('info', 'SUCCESS');
    winston.log('verbose', ack.log());
  }
};

let latest = 0; // Maintains state across successive requests.

setInterval(() => {
  let batch = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    batch.push(mockHl7Source.getNextMessage(latest + i));
  }

  const payload = batch.join('\n');

  const msg = parser.parse(payload);

  winston.log('INFO', 'Sending messages.');
  winston.log('verbose', '\n' + payload);

  client.send(msg, handleResponse);

  latest = latest + BATCH_SIZE;
}, FREQUENCY);

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => winston.log('info', `Running health check listener on port ${PORT}.`));









