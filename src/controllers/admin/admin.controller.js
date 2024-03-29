const { Op } = require('sequelize');

const bestProfession = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get('models');
  const { start, end } = req.query;
  const jobs = await Job.findAll({
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    include: [
      {
        model: Contract,
        as: 'Contract',
        required: true,
        include: [
          {
            model: Profile,
            as: 'Contractor',
            required: true,
            where: {
              type: 'contractor',
            },
          },
        ],
      },
    ],
  });
  const professions = {};
  jobs.forEach((job) => {
    const { profession } = job.Contract.Contractor;
    if (!professions[profession]) {
      professions[profession] = 0;
    }
    professions[profession] += job.price;
  });
  const bestProfession = Object.keys(professions).reduce((a, b) =>
    professions[a] > professions[b] ? a : b
  );
  res.json({ profession: bestProfession, value: professions[bestProfession] });
};
const bestClients = async (req, res) => {
  const { Job, Profile, Contract } = req.app.get('models');
  const { start, end } = req.query;
  const limit = req.query.limit || 2;
  const jobs = await Job.findAll({
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    include: [
      {
        model: Contract,
        as: 'Contract',
        required: true,
        include: [
          {
            model: Profile,
            as: 'Client',
            required: true,
            where: {
              type: 'client',
            },
          },
        ],
      },
    ],
  });
  const clients = {};
  jobs.forEach((job) => {
    const { ClientId } = job.Contract;
    if (!clients[ClientId]) {
      clients[ClientId] = {
        id: ClientId,
        value: 0,
        clientName:
          job.Contract.Client.firstName + ' ' + job.Contract.Client.lastName,
      };
    }
    clients[ClientId].value += job.price;
  });
  const bestClients = Object.keys(clients)
    .sort((a, b) => clients[b].value - clients[a].value)
    .slice(0, limit)
    .map((clientId) => clients[clientId]);
  res.json(bestClients);
};

module.exports = {
  adminController: {
    bestProfession,
    bestClients,
  },
};
