const db = require("$db");
const service_email = require("$services/Mail/index");
const user_model = require("$models/userModel");

const wrongPassword = async (uuid) => {
  //check si l'user a deja une tentative en cours
  let userTentative = await db.tentavive.findUnique({
    where: {
      user_uuid: uuid,
    },
  });
  // si on a pas une fiche tentative on en cree une est on mais wrong_password a 1
  if (userTentative == null) {
    await db.tentavive.create({
      data: {
        user_uuid: uuid,
        sms: 0,
        wrong_password: 1,
      },
    });
  } else {
    // si le nombre de mot de passe erroner et inferieur a ou egal a 2 on increment wrong_password
    if (userTentative.wrong_password <= 2) {
      await db.tentavive.update({
        where: {
          user_uuid: uuid,
        },
        data: {
          wrong_password: userTentative.wrong_password + 1,
        },
      });
    }
    //si wrong password est egale a 3 c'est que le nombre de tentative et atteint on desactive le compte
    if (userTentative.wrong_password == 3) {
      await db.notifications.create({
        data: {
          user_uuid: uuid,
          message: "Brut force detected, account has been disabled, please change password."
        }
      })
      await user_model.desactivateAccount(uuid);
      await db.tentavive.delete({
        where: {
          uuid: userTentative.uuid,
        },
      });
    }
  }
};

const succesLog = async (uuid) => {
  //check si l'user a deja une tentative en cours
  let userTentative = await db.tentavive.findUnique({
    where: {
      user_uuid: uuid,
    },
  });
  // si on a une fiche tentative on supprime
  if (userTentative) {
    await db.tentavive.delete({
      where: {
        uuid: userTentative.uuid,
      },
    });
  }
};

module.exports = { wrongPassword, succesLog };
