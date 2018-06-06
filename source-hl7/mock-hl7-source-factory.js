const sample = require('lodash').sample;

const compiler = require('./data-templates/compiler');

const messageTemplates = {
  infor: [
    require('./data-templates/infor-adt-a02'),
    require('./data-templates/infor-adt-a03-variant-1'),
    require('./data-templates/infor-adt-a03-variant-2'),
    require('./data-templates/infor-adt-a03-variant-3'),
    require('./data-templates/infor-adt-a03-variant-4'),
    require('./data-templates/infor-adt-a03-variant-5'),
    require('./data-templates/infor-adt-a03-variant-6'),
    require('./data-templates/infor-adt-a03-variant-7'),
    require('./data-templates/infor-adt-a10'),
    require('./data-templates/infor-dft'),
    require('./data-templates/infor-zru')
  ],
  other: [
    require('./data-templates/wikipedia-adt-a01'),
    require('./data-templates/fhirblog-oru-r01')
  ],
  hackathon: [
    require('./data-templates/wikipedia-adt-a01'),
    require('./data-templates/infor-adt-a02'),
    require('./data-templates/infor-adt-a03-variant-1'),
    require('./data-templates/infor-adt-a03-variant-2'),
    require('./data-templates/infor-adt-a03-variant-3'),
    require('./data-templates/infor-adt-a03-variant-4'),
    require('./data-templates/infor-adt-a03-variant-5'),
    require('./data-templates/infor-adt-a03-variant-6'),
    require('./data-templates/infor-adt-a03-variant-7'),
    require('./data-templates/infor-adt-a10'),
  ]
  all: [
    require('./data-templates/infor-adt-a02'),
    require('./data-templates/infor-adt-a03-variant-1'),
    require('./data-templates/infor-adt-a03-variant-2'),
    require('./data-templates/infor-adt-a03-variant-3'),
    require('./data-templates/infor-adt-a03-variant-4'),
    require('./data-templates/infor-adt-a03-variant-5'),
    require('./data-templates/infor-adt-a03-variant-6'),
    require('./data-templates/infor-adt-a03-variant-7'),
    require('./data-templates/infor-adt-a10'),
    require('./data-templates/infor-dft'),
    require('./data-templates/infor-zru'),
    require('./data-templates/wikipedia-adt-a01'),
    require('./data-templates/fhirblog-oru-r01')
  ]
};

const generatePatients = (cohortSize) => {
  let patients = [];
  for (let i = 0; i < cohortSize; i++) {
    patients.push(compiler.randomPatient());
  }
  return patients;
};

const create = ({cohortSize, testMessageSuite}) => {
  const patients = generatePatients(cohortSize);

  let current = 0;

  return {
    getNextMessage: (startingControlId) => {
      if (typeof startingControlId !== 'undefined') {
        current = startingControlId;
      }

      const patient = sample(patients);

      const myAdtEvent = sample(messageTemplates[testMessageSuite])({
        timestamp: compiler.dateToHl7(new Date()),
        controlId: current,
        patientName: compiler.componentDelimit('^', patient.name),
        patientSex: patient.sex,
        patientBirthday: patient.birthday,
        patientAddress: compiler.componentDelimit('^', patient.address),
        patientAccountNumber: patient.accountNumber,
        patientSocial: patient.social
      });

      current++;

      return myAdtEvent;

    }
  }
};

module.exports = {
  create
};
