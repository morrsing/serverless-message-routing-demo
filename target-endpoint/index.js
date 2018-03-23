const bodyParser = require('body-parser');
const express = require('express');
const winston = require('winston');

const PORT = process.env.PORT || 3000;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

winston.level = LOG_LEVEL;

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('OK');
});

app.post('/messages', (req, res) => {
  req.body.forEach(message => winston.log('info', message));
  res.end();
});

app.listen(PORT, () => winston.log('info', `Running on port ${PORT}.`));
