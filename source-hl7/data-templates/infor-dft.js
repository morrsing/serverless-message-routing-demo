const compiler = require('./compiler');

const template = [
  'MSH|^~\&|HIS||||${timestamp}||DFT|${controlId}|P|2.1|||',
  'EVN|DFT|20090602144359|',
  'PID|||200056||${patientName}||${patientBirthday}|${patientSex}||2131-1|${patientAddress}|439|8174607415||ENGLISH|S|VAR|${patientAccountNumber}|${patientSocial}||',
  'PV1||I|NICU^NI04^A|U|||1002|1002|00000^00000^00000^00000|MED||||2|||11013^Friend^Ive|I||MA|||||||||||||||||||AA|||||200905171340||2128700|2128700|||',
  'FT1|1|34567||20111215|20111215||Hemoglobin|||1|124.69|124.69|Lab|Infor Insurance Inc.||Bed 1234-B|Fee B Plan|I||||124.69|',
  'FT1|2|34567||20111215|20111215||WBC|||1|24.99|24.99|Lab|Infor Insurance Inc.||Bed 1234-B|Fee B Plan|I||||24.99|',
  'FT1|3|34567||20111215|20111215||Lymphs|||1|156.00|156.00|Lab|Infor Insurance Inc.||Bed 1234-B|Fee B Plan|I||||156.00|',
  'FT1|4|34567||20111215|20111215||Baso|||1|325.89|325.89|Lab|Infor Insurance Inc.||Bed 1234-B|Fee B Plan|I||||325.89|'
].join('\n');

module.exports = compiler.compile(template);
