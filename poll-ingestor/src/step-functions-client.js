const AWS = require('aws-sdk');
if (typeof AWS.config.region === 'undefined') {
  AWS.config.region = process.env.REGION || 'us-east-1';
}

const { STATE_MACHINE_ARN } = process.env;

const StepFunctions = new AWS.StepFunctions();

const processRecord = (record) => new Promise((resolve, reject) => {
  const params = {
    stateMachineArn: STATE_MACHINE_ARN,
    input: JSON.stringify({ message: record })
  };

  StepFunctions.startExecution(params, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

module.exports = {
  processRecord
};
