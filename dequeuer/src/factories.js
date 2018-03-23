const preconditionsFactory = callback => (kinesisStreamId, kinesisShardId) => {
  if (typeof kinesisStreamId === 'undefined') {
    callback('InvalidStreamId');
    return false;
  }

  if (typeof kinesisShardId === 'undefined') {
    callback('InvalidShardId');
    return false;
  }
  return true;
};

module.exports = {
  preconditionsFactory
};
