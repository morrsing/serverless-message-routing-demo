const sha1 = require('sha1');

const generateMessage = (id, timestamp) => {
  return {
    id,
    timestamp,
    message: sha1(timestamp)
  };
};

const generateMessageBatch = (latestId, batchSize) => {
  const batch = [];
  for (let id = latestId; id < batchSize + latestId; id += 1) {
    const timestamp = Date.now();
    batch.push(generateMessage(id, timestamp));
  }
  return batch;
};

module.exports = {
  generateMessageBatch
};
