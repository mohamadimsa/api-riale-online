const db = require("$db");
/**
 * cette fonction nous permet de cree un nouvelle office
 * @param {Objet} data - data office creation
 */
const createBank = async (data) => {
  try {
    return await db.bank.create({ data: data });
  } catch (error) {
    console.log(error.toString());
    return false;
  }
};

module.exports = {
  createBank,
};
