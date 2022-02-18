const db = require("$db");
/**
 * cette fonction nous permet de cree un nouvelle office
 * @param {Objet} data - data office creation
 */
const createOffice = async (data) => {
  try {
    return await db.office.create({ data: data });
  } catch (error) {
    console.log(error.toString());
    return false;
  }
};

module.exports = {
  createOffice,
};
