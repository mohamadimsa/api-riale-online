const db = require("$db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const function_actionKey = require("$services/function/actionKey");
const wrongPassword = require("$services/security/wrongPassword");
const screen = require("$services/security/screen");
const yup = require("yup");
const Kraaken = require("$class/Kraaken");

const Login = async (req, res) => {
  try {
    const session = req.session;

    const schema = yup.object().shape({
      identifiant: yup.string().required(),
      password: yup.string().required(),
    });

    if (
      !(await schema.validate({
        identifiant: req.body.identifiant,
        password: req.body.password,
      }))
    ) {
      return res.status(400).json({
        message: "Bad Request",
        errors: schema.errors,
      });
    }

    /**
     * @description creating credentials
     * @type {{password, identifiant}}
     */
    const credentials = {
      identifiant: req.body.identifiant,
      password: req.body.password,
    };

    /**
     * @description finding the user in DB
     * @type {*}
     */
    const user = await db.user.findUnique({
      where: {
        id_user: credentials.identifiant,
      },
    });
    if (!user) {
      /**
       * @description Sending error to client
       */
      res.status(401);
      return res.send("Wrong credentials");
    }

    /**
     * @description Check if the user has the good credentials
     * @type {*}
     */
    const match = await bcrypt.compare(credentials.password, user.password);

    if (match) {
      //verification d'etat du compte avant log
      if (user.isBanned || user.deleted || user.isSuspended) {
        res.status(401);
        return res.json({
          error: "",
          message: "access denied, contact kraaken for more information",
        });
      }
      //check si un compte et active ou pas
      if (!user.isActive) {
        let key = await function_actionKey.generateActionKey(
          user.uuid,
          "passwordActiveAcount"
        );

        res.status(200);
        return res.json({
          actionKey: {
            key: key.key,
            exp: key.exp,
            action: key.action,
            keyUrl: key.keyUrl,
          },
          message: "change the password to access the service",
        });
      }
      /**
       * @description Generate token
       * @type {jwt}
       */
      const token = jwt.sign(
        { uuid: user.uuid, role: user.role, email: user.email },
        process.env.JWT_SECRET
      );

      /**
       * @description setting user in the session, we can use it to verify security check from token
       */
      if (!session.user) {
        session.user = user;
      }
      await wrongPassword.succesLog(user.uuid);
      return await screen(req, res, user, token);
    } else {
      await db.notifications.create({
        data: {
          message: "A user tried to login with wrong credentials",
          user_uuid: user.uuid,
        },
      });
      await wrongPassword.wrongPassword(user.uuid);

      /**
       * @description Sending error to client
       */
      res.status(401);
      return res.json({
        error: "",
        message: "Wrong credentials",
      });
    }
  } catch (e) {
    /**
     * @description Sending error to sentry
     */
    console.log(e);
    /**
     * @description sending error to client.
     */
    res.status(500);
    return res.send(e.toString());
  }
};

module.exports = Login;
