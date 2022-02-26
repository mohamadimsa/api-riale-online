const db = require("$db");
const service_email = require("$services/Mail/index");
const generator = require("generate-password");
const bcrypt = require("bcrypt");

/**
 * cette fonction nous permet de cree un user
 * @param {Objet} data
 */
const createUser = async (data) => {
  try {
    return await db.user.create({ data: data });
  } catch (error) {
    console.log(error.toString());
    return false;
  }
};
/**
 * nous permet de recuperer les info d'un utilsateur
 * @param {object} where -objet contenant la condition
 * @param {object} select
 * @returns
 */
const getUser = async (where, select = null) => {
  let user = await db.user.findUnique({
    where: where,
    select: select,
  });
  return user;
};
/**
 * permet de update un utilisateur
 * @param {object} where
 * @param {object} data
 */
const updateUser = async (where, data) => {
  await db.user.update({
    where: where,
    data: data,
  });
  return true;
};
/**
 * permet de desactiver un compte
 */
const desactivateAccount = async (uuid) => {
  let user = await getUser({ uuid: uuid });
  try {
    const password = generator.generate({ length: 10, numbers: true });
    await updateUser(
      { uuid: uuid },
      { isActive: false, password: bcrypt.hashSync(password, 12) }
    );
    service_email.sendMail("DesactivateAccount", "fr", [
      {
        email: user.email,
        subject: "votre compte à était désactiver",
        password: password,
        name: user.name,
      },
    ]);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  desactivateAccount,
  getUser,
  updateUser,
  createUser
};
