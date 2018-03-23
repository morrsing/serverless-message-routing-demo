const request = require('superagent');
const winston = require('winston');

const { processRecord } = require('./step-functions-client');
const { METHOD_REQUESTER_MAP } = require('./constants');
const { preconditionsFactory } = require('./factories');

const { ENDPOINT, METHOD } = process.env;

const handler = (event, context, callback) => {
  winston.log('info', 'Poll ingester invoked.');
  const checkPreconditions = preconditionsFactory(callback);

  if (checkPreconditions(ENDPOINT, METHOD)) {
    const method = METHOD_REQUESTER_MAP[METHOD];
    request[method](ENDPOINT).end((err, res) => {
      if (err) {
        callback(err);
        return;
      }

      const messages = JSON.parse(res.text);
      messages.forEach((message) => {
        winston.log('info', message);
      });

      Promise.all(messages.map(processRecord)).then((result) => {
        callback(null, result);
      }).catch((err) => {
        callback(err);
      });
    });
  }
};

export default handler;
