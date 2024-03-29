const { Op } = require('sequelize');

const getUnpaidJobs = async (req, res) => {
  const { Job, Contract } = req.app.get('models');
  const jobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true,
      },
    },
    include: [
      {
        model: Contract,
        as: 'Contract',
        where: {
          clientId: req.get('profile_id'),
          status: 'in_progress',
        },
      },
    ],
  });
  res.json(jobs);
};
const payJob = async (req, res) => {
  const transaction = await req.app.get('sequelize').transaction();
  try {
    const { Job, Profile, Contract } = req.app.get('models');
    const { job_id } = req.params;
    const job = await Job.findOne({
      where: {
        id: job_id,
        paid: {
          [Op.not]: true,
        },
      },
      include: [
        {
          model: Contract,
          as: 'Contract',
          where: {
            clientId: req.get('profile_id'),
          },
          required: true,
          include: [
            {
              model: Profile,
              as: 'Contractor',
              where: {
                type: 'contractor',
              },
            },
            {
              model: Profile,
              as: 'Client',
              where: {
                type: 'client',
              },
            },
          ],
        },
      ],
      transaction,
    });
    if (!job) {
      return res.status(404).end();
    }
    if (job.price >= job.Contract.Client.balance) {
      return res.status(400).json({ error: 'Insufficient funds' });
    } else {
      job.Contract.Client.balance -= job.price;
      job.Contract.Contractor.balance += job.price;
      job.paid = true;
      await job.Contract.Client.save({ transaction });
      await job.Contract.Contractor.save({ transaction });
      await job.save({ transaction });
      await transaction.commit();
    }
    res.json({
      message: `Job ${job_id} paid successfully. Value: ${job.price}`,
    });
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  jobsController: {
    getUnpaidJobs,
    payJob,
  },
};
