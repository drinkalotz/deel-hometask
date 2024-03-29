const { Op } = require('sequelize');

const depositBalance = async (req, res) => {
  const transaction = await req.app.get('sequelize').transaction();
  const { Job, Profile, Contract } = req.app.get('models');
  const { deposit } = req.body;
  const { userId } = req.params;
  const jobs = await Job.findAll(
    {
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
            clientId: userId,
          },
          required: true,
          include: [
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
    },
    { transaction }
  );
  const sum = jobs.reduce((acc, job) => acc + job.price, 0);
  if (sum * 0.25 < deposit) {
    return res.status(400).send({ error: 'Deposit is too high' });
  }
  try {
    await Profile.increment('balance', {
      by: deposit,
      where: {
        id: userId,
      },
      transaction,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({ error: 'Error depositing balance' });
  }
  res.status(200).end();
};

module.exports = {
  balancesController: {
    depositBalance,
  },
};
