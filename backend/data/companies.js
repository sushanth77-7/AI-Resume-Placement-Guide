const productCompanies = require('./productCompanies');
const serviceCompanies = require('./serviceCompanies');

const allCompanies = [...productCompanies, ...serviceCompanies];

module.exports = {
  productCompanies,
  serviceCompanies,
  allCompanies
};
