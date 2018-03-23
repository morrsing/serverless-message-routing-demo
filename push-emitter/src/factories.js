const responseHandlerFactory = callback => (err) => {
  if (err) {
    callback('ERROR');
  } else {
    callback(null, 'SUCCESS');
  }
};

const preconditionsFactory = callback => (endpoint) => {
  if (typeof endpoint === 'undefined') {
    callback('InvalidEndpoint');
    return false;
  }
  return true;
};

module.exports = {
  responseHandlerFactory,
  preconditionsFactory
};
