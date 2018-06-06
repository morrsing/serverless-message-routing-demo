const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS||||${timestamp}||ADT^A03|${controlId}|P|2.1|||',
  'EVN|A03|20090602144359|||',
  'PID|||200056||${patientName}||${patientBirthday}|${patientSex}||2131-1|${patientAddress}|439|8174607415||ENGLISH|S|VAR|${patientAccountNumber}|${patientSocial}||',
  'PV1||I|NICU^NI04^A|U|||1002|1002|00000^00000^00000^00000|MED||||2|||11013^Friend^Ive|I||MA|||||||||||||||||||AA|||||200905171340||2128700|2128700|||',
  'Z01|NONE|',
  'Z02|1|SLEEP STUDY|',
  'Z02|2|OXIMETRY|',
  'Z02|3|CPAP|'
].join('\n');

module.exports = compiler.compile(template);
