const { Op } = require('sequelize');

const getContractById = async (req, res) => {
  const { Contract } = req.app.get('models');
  const profileId = req.get('profile_id');
  const { id } = req.params;
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  if (!contract) return res.status(404).end();
  res.json(contract);
};

const getNonTerminatedContracts = async (req, res) => {
  const { Contract } = req.app.get('models');
  const profileId = req.get('profile_id');
  const contracts = await Contract.findAll({
    where: {
      status: {
        [Op.not]: 'terminated',
      },
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  res.json(contracts);
};

module.exports = {
  contractsController: {
    getContractById,
    getNonTerminatedContracts,
  },
};
