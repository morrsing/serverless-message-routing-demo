const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS||||${timestamp}||ADT^A03|${controlId}|P|2.1|||',
  'EVN|A03|20090602142647|||',
  'PID|||200056||${patientName}||${patientBirthday}|${patientSex}||2106-3|${patientAddress}|439|8174607415||ENGLISH|S|VAR|${patientAccountNumber}|${patientSocial}||',
  'PV1||O||R|||60188|60188|00000^00000^00000^00000|MED||||2|||60188^Crozier^Joseph^^^Dr.|OO|2|CI|||||||||||||||||||AA|||||200905200922|200906021426|1560900|1560900|||',
  'Z01|DECLAMYCIN~IBUPROPHEN~ASPIRIN~ACETOMINOPHEN||',
  'Z02|1|XR CHEST|',
  'Z02|2|XR ABDOMEN|',
  'Z02|3|XR PELVIS|',
  'Z02|4|XR LSPINE|',
  'Z02|5|XR TSPINE|'
].join('\n');

module.exports = compiler.compile(template);
