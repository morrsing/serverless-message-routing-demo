const compiler = require('./compiler');

const template = [
  'MSH|^~\&|Amalga HIS|BUM|New Tester|MS|${timestamp}||ORU^R01|${controlId}|P|2.4|||AL|NE|764|ASCII|||',
  'PID||100005056|100005056||${patientName}|""|${patientBirthday}|${patientSex}||CA|${patientAddress}||326-2275^PRN^PH^^66^675~476-5059^ORN^CP^^66^359~-000-9999^ORN^FX^^66^222~^NET^X.400^a@a.a~^NET^X.400^dummy@hotmail.com|123456789^WPN^PH^^66|UNK|S|BUD|${patientAccountNumber}|${patientSocial}|D99999^""||CA|Bangkok|||THA||THA|""|N',
  'PV1||OPD   ||||""^""^""||||CNSLT|||||C|VIP|||6262618|PB1||||||||||||||||||||||||20101208134638',
  'PV2|||^Unknown|""^""||||""|""|0||""|||||||||||||||||||||||||||||HP1',
  'ORC|NW|""|BMC1102771601|""|CM||^^^^^""|||||||||""^""^^^""',
  'OBR|1|""|BMC1102771601|""^Brain (CT)||20111028124215||||||||||||||||||CTSCAN|F||^^^^^ROUTINE|||""||||||""|||||||||||^""',
  'OBX|1|FT|""^Brain (CT)||++++ text of report goes here +++|||REQAT|||F|||20111121103040||75929^Gosselin^Angelina'
].join('\n');

module.exports = compiler.compile(template);
