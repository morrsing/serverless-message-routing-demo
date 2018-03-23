const request = require('superagent');

const {ENDPOINT} = process.env;
const { responseHandlerFactory, preconditionsFactory } = require('./factories');

const handler = (event, context, callback) => {
  const handleResponse = responseHandlerFactory(callback);
  const checkPreconditions = preconditionsFactory(callback);

  checkPreconditions(ENDPOINT);

  request.post(ENDPOINT)
    .send([event.message])
    .set('accept', 'json')
    .end(handleResponse);
};

export default handler;
