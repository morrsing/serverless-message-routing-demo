const compiler = require('./compiler');

const template = [
  'MSH|^~\&|MegaReg|XYZHospC|SuperOE|XYZImgCtr|${timestamp}||ADT^A01^ADT_A01|${controlId}|P|2.5',
  'EVN||200605290901||||200605290900',
  'PID|||56782445^^^UAReg^PI||${patientName}||${patientBirthday}|${patientSex}||2028-9^^HL70005^RA99113^^XYZ|${patientAddress}|||||||${patientAccountNumber}|${patientSocial}',
  'PV1||I|W^389^1^UABH^^^^3||||12345^MORGAN^REX^J^^^MD^0010^UAMC^L||67890^GRAINGER^LUCY^X^^^MD^0010^UAMC^L|MED|||||A0||13579^POTTER^SHERMAN^T^^^MD^0010^UAMC^L|||||||||||||||||||||||||||200605290900',
  'OBX|1|NM|^Body Height||1.80|m^Meter^ISO+|||||F',
  'OBX|2|NM|^Body Weight||79|kg^Kilogram^ISO+|||||F',
  'AL1|1||^ASPIRIN',
  'DG1|1||786.50^CHEST PAIN, UNSPECIFIED^I9|||A'
].join('\n');

module.exports = compiler.compile(template);
