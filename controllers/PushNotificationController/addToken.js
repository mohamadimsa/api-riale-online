const db = require("$db");
const { decryptage } = require("$services/function/chifrement");
const yup = require("yup");
const addToken = async (req, res) => {
  try {
    //on verifie que le token et bien renseigner
    const schema = yup.object().shape({
      token: yup.string().required(),
    });
    if (!(await schema.validate({ token: req.params.token }))) {
      return res.status(400).json({
        message: "Bad Request",
        errors: schema.errors,
      });
    }

    /**
     * on verifie si le token n'est pas deja enregistrer dans la db
     */
    let token = await db.tokenPushNotification.findUnique({
      where: {
        token: req.params.token,
      },
    });
    //si on trouve une entrer corespondant au token
    if (token) {
      //on verifie si le token est attribuer a un autre user
      if (token.user_uuid != req.user) {
        console.log("different");
        await db.tokenPushNotification.update({
          where: {
            token: token.token,
          },
          data: {
            user_uuid: req.user,
          },
        });
        return res.status(200).json({
          message: "le token push notification a bien était mise à jour",
        });
      }
    } else {
      //on rajoute le token dans le tableau des token notif
      await db.tokenPushNotification.create({
        data: {
          isActive: true,
          token: req.params.token,
          user_uuid: req.user,
        },
      });
    }
    return res.status(201).json({
      message: "le token push notification a bien était ajouter",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

module.exports = addToken;
