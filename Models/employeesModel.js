const db = require("$db");

/**cette fonction nous permet de cree un employer
 * @param {objet} data
 * @returns {Promise}
 */
const createEmployee = async (data) => {
  try {
    return await db.employees.create({ data: data });
  } catch (error) {
    console.log(error.toString());
    return false;
  }
};

module.exports = {
  createEmployee,
};
