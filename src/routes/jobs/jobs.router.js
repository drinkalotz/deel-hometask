const { jobsController } = require('../../controllers/jobs/jobs.controller');
const { getProfile } = require('../../middleware/getProfile');
const { Router } = require('express');

const jobsRouter = Router();
jobsRouter
  .get('/jobs/unpaid', getProfile, jobsController.getUnpaidJobs)
  .post('/jobs/:job_id/pay', getProfile, jobsController.payJob);

module.exports = {
  jobsRouter,
};
