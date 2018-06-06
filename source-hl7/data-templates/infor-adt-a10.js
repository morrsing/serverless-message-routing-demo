const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS||||${timestamp}||ADT^A10|${controlId}|P|2.1|||',
  'EVN|A13|19930602144359|||',
  'PID|||200056||${patientName}||${patientBirthday}|${patientSex}||1|${patientAddress}|439|8174607415||ENGLISH|S|Z|${patientAccountNumber}|${patientSocial}||',
  'PV1||I|NICU^NI02^A|2|||1002|1002|00000^00000^00000^00000|MED||||2|||11013^Friend^Ida|I||MA|||||||||||||||||||AA|||||199305171340||2128500|2128500|||'
].join('\n');

module.exports = compiler.compile(template);
