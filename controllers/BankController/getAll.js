const { getBanks } = require("$models/bankModel");

const getAllBanks = async (req, res) => {
  if (await getBanks()) {
    try {
      const banks = await getBanks();
      res.status(200).json({ data: banks });
    } catch (error) {
      res.status(500);
      console.log(error.toString());
    }
  }
};

module.exports = getAllBanks;
