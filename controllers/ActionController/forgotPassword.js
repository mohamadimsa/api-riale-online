const service_sms = require("$services/Sms/sms");
const actionKey = require("$services/function/actionKey");
const service_email = require("$services/Mail/index");
const generator = require("generate-password");
const db = require("$db");
const yup = require("yup");

const forgotPassword = async (req, res) => {
  const { phone, email } = req.body;
  //si aucune adress mail ou telephone et renseigner on retourne un message d'erreur
  const schema = yup.object().shape({
    phone: yup.string().required(),
    email: yup.string().uuid().required()
  })

  if (! await schema.validate({phone, email})){
    return res.status(400).json({
      message: 'Bad Request',
      errors: schema.errors
    })
  }
  if (email) {
    //on verifie qu'un utilisateur est bien assosier a cette email
    let user = await checkEmail(email);
    if (
      user 
      &&
      user.isActive 
      &&
      !user.isSuspended &&
      !user.isBanned &&
      !user.deleted
    ) {
      const key = await actionKey.generateActionKey(user.uuid, "resetPassword");
      //envois email pour renitialiser le mot de passe
      service_email.sendMail("ResetPassword", "fr", [
        {
          email: user.email,
          url: process.env.URL_CLIENT + "/reset-password/key=" + key.keyUrl,
          subject: "demande de réinitialisation de mot de passe",
          name: user.name,
        },
      ]);
      await db.notifications.create({
        data: {
          user_uuid: user.uuid,
          message: "Password has been reset by forgot password."
        }
      })
      res.status(200);
      return res.json({
        message: "request taken into account",
      });
    }
    res.status(400);
    return res.json({
      error: "",
      message: "unknown email address",
    });

  }
};

const checkEmail = async (email) => {
  let user = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return user;
  }
  return false;
};

module.exports = forgotPassword;
