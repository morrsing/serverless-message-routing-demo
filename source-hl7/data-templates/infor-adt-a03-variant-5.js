const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS||||${timestamp}||ADT^A03|${controlId}|P|2.1|||',
  'EVN|A03|20090602144359|||',
  'PID|||200056||${patientName}||${patientBirthday}|${patientSex}||2131-1|${patientAddress}|439|8174607415||ENGLISH|S|VAR|${patientAccountNumber}|${patientSocial}||',
  'PV1||I|NICU^NI02^A|U|||1002|1002|00000^00000^00000^00000|MED||||2|||11013^Friend^Ida|I||MA|||||||||||||||||||AA|||||200905171340||2128500|2128500|||',
  'Z01|PEANUTS~SESAME~GLUTEN~SOY~SULFITES|',
  'Z02|1|EKG|',
  'Z02|2|STRESS TEST|',
  'Z02|3|ECHOCARDIOGRAM|',
  'Z02|4|US RENAL|'
].join('\n');

module.exports = compiler.compile(template);
