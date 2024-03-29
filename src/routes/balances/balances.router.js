const {
  balancesController,
} = require('../../controllers/balances/balances.controller');
const { getProfile } = require('../../middleware/getProfile');
const { Router } = require('express');

const balancesRouter = Router();

balancesRouter.post(
  '/balances/deposit/:userId',
  getProfile,
  balancesController.depositBalance
);

module.exports = {
  balancesRouter,
};
