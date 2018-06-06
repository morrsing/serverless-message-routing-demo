const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS|Memorial|||${timestamp}||ADT^A03|${controlId}|P|2.1|||',
  'EVN|A03|19930603090227|||',
  'PID|||200062||${patientName}||${patientBirthday}|${patientSex}||1|${patientAddress}|439|||ENGLISH|S|L|${patientAccountNumber}|${patientSocial}||',
  'PV1||I||1|||10091|10091|00000^00000^00000^00000|MED||||7|||10091^Einstein^Albert^^^Dr.|IE|1|CI|||||||||||||||||||AA|||||199305110906|199306030859|3121800|3121800|||'
].join('\n');

module.exports = compiler.compile(template);
