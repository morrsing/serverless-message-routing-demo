const { KINESIS_STREAM_ID, KINESIS_SHARD_ID } = process.env;
const { preconditionsFactory } = require('./factories');
const client = require('./kinesis-client');

const handler = (event, context, callback) => {

  const checkPreconditions = preconditionsFactory(callback);
  const fromTimestamp = parseInt(event.queryStringParameters.timestamp);

  if (checkPreconditions(KINESIS_STREAM_ID, KINESIS_SHARD_ID, fromTimestamp)) {
    client.getShardIterator({
      ShardId: KINESIS_SHARD_ID,
      ShardIteratorType: 'AT_TIMESTAMP',
      StreamName: KINESIS_STREAM_ID,
      Timestamp: fromTimestamp
    }).then(shardIterator => client.consume(shardIterator)).then((result) => {
      const messages = result.Records.map((record) => {
        try {
          return JSON.parse(record.Data.toString());
        } catch(err) {
          return {}; // Recommend useful error handling.
        }
      });

      const response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(messages)
      };

      callback(null, response);
    }).catch((err) => {
      callback(err);
    });
  }
};

export default handler;
