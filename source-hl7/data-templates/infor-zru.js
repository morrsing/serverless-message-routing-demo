const compiler = require('./compiler');

const template = [
  'MSH|^~\&|CL05|CLH|OCF|OCF|${timestamp}||ZRU|${controlId}||2.1',
  'PID||5158454318|860329F||${patientName}|||${patientSex}||||||||||${patientAccountNumber}',
  'OBR||11141223||7584A=^L/S RATI^L/S RATIO WITH PG|R||199411141033|||||||199411141223||MD TEMP||||||199411161530|||F||^^^^^R',
  'ZRS|2202|PG GREATER THAN OR EQUAL TO 1.25 MG/DL',
  'ZRS|7722|LECITHIN LEVEL >5MG/DL',
  'ZRS|4560|A CREATININE LEVEL >2.0 MG/DL'
].join('\n');

module.exports = compiler.compile(template);
