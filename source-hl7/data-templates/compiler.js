const curry = require('lodash').curry;
const moment = require('moment');

const seeds = require('./seeds');

const OLDEST_PERSON = 119;

const compile = curry((template, parameters) => {
  let compiledMessage = new String(template);

  Object.keys(parameters).forEach((key) => {
    compiledMessage = compiledMessage.replace('${' + key + '}', parameters[key]);
  });

  return compiledMessage;
});

const dateToHl7 = date => moment(date).format('YYYYMMDDhhmmss');
const componentDelimit = (delimiter, string) => string.replace(/\W/g, delimiter);

const randomInt = max => Math.floor(Math.random() * Math.floor(max));

const randomName = (sex) => `${seeds.names.first[sex][randomInt(100)]} ${seeds.names.last[randomInt(200)]}`;

const randomSex = () => (['male','female'])[randomInt(2)];

const randomPatient = () => {
  const sex = randomSex();

  return {
    name: randomName(sex),
    sex: {'male': 'M', 'female': 'F'}[sex],
    birthday: moment().subtract(randomInt(OLDEST_PERSON), 'years').month(randomInt(12)).day(randomInt(28)).format('YYYYMMDD'),
    address: seeds.addresses[randomInt(234)],
    accountNumber: `${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}`,
    social: `${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}`
  };
};

module.exports = {
  compile,
  dateToHl7,
  componentDelimit,
  randomPatient
};
