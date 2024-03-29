const {
  contractsController,
} = require('../../controllers/contracts/contracts.controller');
const { getProfile } = require('../../middleware/getProfile');
const { Router } = require('express');

const contractRouter = Router();
contractRouter
  .get('/contracts/:id', getProfile, contractsController.getContractById)
  .get('/contracts', getProfile, contractsController.getNonTerminatedContracts);

module.exports = {
  contractRouter,
};
