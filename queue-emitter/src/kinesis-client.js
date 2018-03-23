const AWS = require('aws-sdk');
if (typeof AWS.config.region === 'undefined') {
  AWS.config.region = process.env.REGION || 'us-east-1';
}

const kinesis = new AWS.Kinesis();

const sendToKinesis = params => new Promise((resolve, reject) => {
  kinesis.putRecord(params, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});

module.exports = {
  produce: sendToKinesis
}
