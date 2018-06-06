const request = require('superagent');
const filter = require('lodash').filter;

const epxress = require('express');
const hl7 = require('simple-hl7');
const winston = require('winston');

const ROUTE_ENDPOINT = process.env.ROUTE_ENDPOINT;

const LOG_LEVEL = process.env.LOG_LEVEL || 'verbose';

const HL7_SERVER_PORT = parseInt(process.env.HL7_SERVER_PORT || 7777);
const HTTP_SERVER_PORT = parseInt(process.env.HTTP_SERVER_PORT || 3000);

if (typeof ROUTE_ENDPOINT === 'undefined') {
  throw new Error('Invalid route endpoint.');
}

winston.level = LOG_LEVEL;

const httpServerApp = epxress();
const hl7ServerApp = hl7.tcp();

const messageLogger = (req, res, next) => {
  winston.log('info', 'messages received');
  winston.log('verbose', req.msg.log());
  next();
};

const acker = (req, res) => {
  winston.log('verbose', 'sending ack');
  res.end();
};

const producer = (req, res, next) => {
  // Split batch messages by MSH presence.
  const messages = filter(req.msg.log().split('MSH|'), msg => msg.length > 0)
      .map(msg => `MSH|${msg}`);

  winston.log('info', 'Sending HL7 blobs into route.');
  messages.forEach((msg) => { winston.log('verbose', msg); });

  request.post(ROUTE_ENDPOINT)
      .send(messages)
      .set('accept', 'json')
      .end((err, res) => {
        if (err) {
          winston.log('warn', 'Error.');
          winston.log('verbose', err);
          next(err);
        } else {
          winston.log('info', 'Success');
          winston.log('verbose', res.text);
          next();
        }
      });
};

const errorHandler = (err, req, res) => {
  //error handler
  //standard error middleware would be
  winston.log('warn', 'ERROR');
  winston.log('verbose', err);

  const msa = res.ack.getSegment('MSA');
  msa.editField(1, 'AR');
  res.ack.addSegment('ERR', err.message);
  res.end();
};

hl7ServerApp.use(messageLogger);
hl7ServerApp.use(producer);
hl7ServerApp.use(acker);
hl7ServerApp.use(errorHandler);
hl7ServerApp.start(HL7_SERVER_PORT);

winston.log('info', `Running HL7 TCP proxy listener on port ${HL7_SERVER_PORT}`);


httpServerApp.get('/', (req, res) => {
  res.send('OK');
});

httpServerApp.listen(HTTP_SERVER_PORT, () => winston.log('info', `Running health check listener on port ${HTTP_SERVER_PORT}.`));
