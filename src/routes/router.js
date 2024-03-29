const { contractRouter } = require('./contracts/contracts.router.js');
const { jobsRouter } = require('./jobs/jobs.router.js');
const { balancesRouter } = require('./balances/balances.router.js');
const { adminRouter } = require('./admin/admin.router.js');

module.exports = {
  router: { contractRouter, jobsRouter, balancesRouter, adminRouter },
};
