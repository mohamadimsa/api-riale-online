const db = require("$db");
/**
 * cette fonction nous permet de cree un nouveau historique interne
 * @param {Objet} data - data 
 */
const createHistoricalInternal = async (data) => {
  try {
    return await db.historicalInternal.create({ data: data });
  } catch (error) {
    console.log(error.toString());
    return false;
  }
};

module.exports = {
    createHistoricalInternal,
};