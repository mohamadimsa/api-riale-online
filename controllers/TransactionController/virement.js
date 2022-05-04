const db = require("$db");
const { decryptage } = require("$services/function/chifrement");
const yup = require("yup");
const bcrypt = require("bcrypt");
const process_virement = require("$services/bancaire/virement");
const virement = async (req, res) => {
  /**
   * on verifie que l'action (donner encryper est bien renseigner)
   */
  action = req.body.action;
  try {
    const schema = yup.object().shape({
      action: yup.string().required(),
    });
    if (!(await schema.validate({ action: action }))) {
      return res.status(400).json({
        message: "Bad Request",
        errors: schema.errors,
      });
    }
    /**
     * decryptage de la data
     */
    let decrypt = JSON.parse(decryptage(action));
    /**
     * on verifie qu'on a bien tout la data qu'on a besion pour effectuer le virement
     */
    const virement = yup.object().shape({
      password: yup.string().required(),
      from: yup.string().required(),
      to: yup.string().required(),
      amount: yup.number().required(),
      message: yup.string(),
    });
    if (
      !(await virement.validate({
        password: decrypt.password,
        from: decrypt.from,
        to: decrypt.to,
        amount: decrypt.amount,
        message: decrypt.message,
      }))
    ) {
      return res.status(400).json({
        message: "Bad Request",
        errors: schema.errors,
      });
    }
    /**
     * on verifie quelle plateforme la requette et envoyer afin de verifier le password
     * si c'est un employer ou un utilisateur
     */
    if (req.platform == "riale-logiciel") {
      let user = await db.employees.findUnique({
        where: {
          user_uuid: req.user,
        },
      });
      match = await bcrypt.compare(decrypt.password, user.secretKey);
      if (!match) {
        return res.status(401).json({
          message: "wrong credential",
        });
      }
    } else {
      let user = await db.user.findUnique({
        where: {
          uuid: req.user,
        },
      });
      match = await bcrypt.compare(decrypt.password, user.secretKey);
      if (!match) {
        return res.status(401).json({
          message: "wrong credential",
        });
      }
    }

    /**
     * si tout est bon on efffectue le virement
     */
    process_viremnpment(
      {
        from: decrypt.from,
        to: decrypt.to,
        amount: decrypt.amount,
        message: decrypt.message ? decrypt.message : null,
      },
      req.user
    )
      .then((response) => {
        return res.status(201).json({
          message: "le virement a bien etait effectuer",
        });
      })
      .catch((e) => {
        return res.status(400).json({
          message: e,
        });
      });
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};

module.exports = virement;
