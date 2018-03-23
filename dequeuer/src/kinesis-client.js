const AWS = require('aws-sdk');
if (typeof AWS.config.region === 'undefined') {
  AWS.config.region = process.env.REGION || 'us-east-1';
}

const kinesis = new AWS.Kinesis();

const readfromKinesis = params => new Promise((resolve, reject) => {
  kinesis.getRecords(params, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  })
});

const getShardIterator = params => new Promise((resolve, reject) => {
  kinesis.getShardIterator(params, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  })
});

module.exports = {
  consume: readfromKinesis,
  getShardIterator: getShardIterator
}
