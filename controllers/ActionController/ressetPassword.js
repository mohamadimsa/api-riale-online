const db = require("$db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user_model = require("$models/userModel");
const actionKey = require("$services/function/actionKey");
const service_email = require("$services/Mail/index");

const ressetPassword = async (req, res) => {
  const { key } = req.params,
    { password } = req.body;

  if (!password || !key) {
    res.status(401);
    return res.json({
      error: "",
      message: "a password a key and mandatory to perform this action",
    });
  }
  let keyAction = actionKey.getKeyUrl(req);

  if (await actionKey.isValidActionKey(keyAction, "passwordActiveAcount")) {
    /**
     * @description Generate token
     * @type {jwt}
     */
    const token = jwt.sign(
      { uuid: actionKey.getUuid(keyAction) },
      process.env.JWT_SECRET
    );
    await db.user.update({
      where: {
        uuid: actionKey.getUuid(keyAction),
      },
      data: {
        isActive: true,
        actionKey: {},
        password: bcrypt.hashSync(password, 12),
      },
    });
    let user = await user_model.getUser({ uuid: actionKey.getUuid(keyAction) });
    let newkeyAction = await actionKey.generateActionKey(
      user.uuid,
      "usurpation",
      "24H"
    );
    service_email.sendMail("ChangementPassword", "fr", [
      {
        email: user.email,
        subject: "confirmation changement de mot de passe",
        name: user.name,
        url:
          process.env.URL_CLIENT +
          "/confirmation/signale-usurpation?key=" +
          newkeyAction.keyUrl,
      },
    ]);

    res.status(201);
    return res.json({
      token: token,
      message:
        "password change taken into account, account successfully activated",
    });
  } else if (await actionKey.isValidActionKey(keyAction, "resetPassword")) {
    await db.user.update({
      where: {
        uuid: actionKey.getUuid(keyAction),
      },
      data: {
        actionKey: {},
        password: bcrypt.hashSync(password, 12),
      },
    });
    let user = await user_model.getUser({ uuid: actionKey.getUuid(keyAction) });
    //envois 
    let newkeyAction = await actionKey.generateActionKey(
      user.uuid,
      "usurpation",
      "24H"
    );
    service_email.sendMail("ChangementPassword", "fr", [
      {
        email: user.email,
        subject: "confirmation changement de mot de passe",
        name: user.name,
        url:
          process.env.URL_CLIENT +
          "/confirmation/signale-usurpation?key=" +
          newkeyAction.keyUrl,
      },
    ]);
    res.status(201);
    return res.json({
      message: "password change taken into account",
    });
  }
  res.status(401);
  return res.json({
    error: "",
    message: "wrong key",
  });
};

module.exports = ressetPassword;
