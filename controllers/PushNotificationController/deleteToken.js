const db = require("$db");
const { decryptage } = require("$services/function/chifrement");
const yup = require("yup");
const deleteToken = async (req, res) => {
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
    //si on trouve une entrer corespondant au token on supprime l'entrer liee au token
    if (token) {
      await db.tokenPushNotification.delete({
        where: {
          token: token.token,
        },
      });
      return res.status(201).json({
        message: "le token push notification a bien était supprimer",
      });
    }
    return res.status(400).json({
      message: "token introuvable",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

module.exports = deleteToken;
