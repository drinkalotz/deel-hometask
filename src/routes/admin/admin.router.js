const { adminController } = require('../../controllers/admin/admin.controller');
const { getProfile } = require('../../middleware/getProfile');
const { Router } = require('express');

const adminRouter = Router();

adminRouter
  .get('/admin/best-profession', getProfile, adminController.bestProfession)
  .get('/admin/best-clients', getProfile, adminController.bestClients);

module.exports = {
  adminRouter,
};
