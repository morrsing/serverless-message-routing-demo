const { KINESIS_STREAM_ID, KINESIS_SHARD_ID } = process.env;
const { preconditionsFactory } = require('./factories');
const client = require('./kinesis-client');

const handler = (event, context, callback) => {
  const checkPreconditions = preconditionsFactory(callback);

  if (checkPreconditions(KINESIS_STREAM_ID, KINESIS_SHARD_ID)) {
    client.produce({
      Data: JSON.stringify(event.message),
      PartitionKey: KINESIS_SHARD_ID,
      StreamName: KINESIS_STREAM_ID,
    }).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    });
  }
};

export default handler;
