const preconditionsFactory = callback => (stateMachineArn) => {
  if (typeof stateMachineArn === 'undefined') {
    callback('InvalidStateMachineArn');
    return false;
  }

  return true;
};

module.exports = {
  preconditionsFactory
};
