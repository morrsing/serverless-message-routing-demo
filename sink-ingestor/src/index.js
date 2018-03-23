const { processRecord } = require('./step-functions-client')
const { preconditionsFactory } = require('./factories');
const { STATE_MACHINE_ARN } = process.env;

const fixApiGatewayObjectTreatment =  (mungedRecord) => {
  let correctedRecord = mungedRecord.replace(/=/g, '":"');
  correctedRecord = correctedRecord.replace(/{/g, '{"');
  correctedRecord = correctedRecord.replace(/}/g, '"}');
  correctedRecord = correctedRecord.replace(/, /g, ',');
  correctedRecord = correctedRecord.replace(/,/g, '","');
  return correctedRecord;
}

const handler = (event, context, callback) => {
  const checkPreconditions = preconditionsFactory(callback);

  if (checkPreconditions(STATE_MACHINE_ARN)) {
    const messages = event.Records.map(record => Buffer.from(record.kinesis.data, 'base64').toString())
      .map(fixApiGatewayObjectTreatment)
      .map(JSON.parse);

    Promise.all(messages.map(processRecord)).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    });
  }
};

export default handler;
