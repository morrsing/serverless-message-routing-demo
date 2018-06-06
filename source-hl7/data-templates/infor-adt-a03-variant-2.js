const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS||||${timestamp}||ADT^A03|${controlId}|P|2.1|||',
  'EVN|A03|20090603090227|||',
  'PID|||200062||${patientName}||${patientBirthday}|${patientSex}||2106-3|${patientAddress}|439|||ENGLISH|S|SPI|${patientAccountNumber}|${patientSocial}||',
  'PV1||I||A|||10091|10091|00000^00000^00000^00000|MED||||7|||10091^Einstein^Albert^^^Dr.|IE|1|CI|||||||||||||||||||AA|||||200905110906|200906030859|3121800|3121800|||',
  'Z01|PENICILLIN~MILK SOLIDS|',
  'Z02|1|CT BRAIN|',
  'Z02|2|CONTRAST|'
].join('\n');

module.exports = compiler.compile(template);
