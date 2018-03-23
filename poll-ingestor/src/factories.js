const includes = require('lodash/includes');

const { METHOD_REQUESTER_MAP } = require('./constants');

const isValidMethod = method => includes(Object.keys(METHOD_REQUESTER_MAP), method);

const preconditionsFactory = callback => (endpoint, method) => {
  if (typeof endpoint === 'undefined') {
    callback('InvalidEndpoint');
    return false;
  }

  if (!isValidMethod(method)) {
    callback('InvalidRequestMethod');
    return false;
  }

  return true;
};

module.exports = {
  preconditionsFactory
};
