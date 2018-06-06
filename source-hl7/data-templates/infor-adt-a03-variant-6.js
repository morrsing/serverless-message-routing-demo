const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS||||${timestamp}||ADT^A03|${controlId}|P|2.1|||',
  'EVN|A03|20090602144359|||',
  'PID|||200056||${patientName}||${patientBirthday}|${patientSex}||2131-1|${patientAddress}|439|8174607415||ENGLISH|S|VAR|${patientAccountNumber}|${patientSocial}||',
  'PV1||I|NICU^NI03^A|U|||1002|1002|00000^00000^00000^00000|MED||||2|||11013^Friend^Ima|I||MA|||||||||||||||||||AA|||||200905171340||2128600|2128600|||',
  'Z01|TREE NUTS~RAGWEED~SOY~FISH|',
  'Z02|1|GLYCOHEMOGLOBIN|',
  'Z02|2|HEPATIC FUNCTION PANEL|',
  'Z02|3|HEMATOLOGY PANEL|',
  'Z02|4|BASIC METABOLIC PANEL|'
].join('\n');

module.exports = compiler.compile(template);
