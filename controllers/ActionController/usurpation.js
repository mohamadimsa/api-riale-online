const Sentry = require("$sentry");
const user_model = require("$models/userModel");
const actionKey = require("$services/function/actionKey");
const db = require("$db");

const usurpation = async (req, res) => {
  if (
    await actionKey.isValidActionKey(actionKey.getKeyUrl(req), "usurpation")
  ) {
    const key = actionKey.getKeyUrl(req);
    await user_model.desactivateAccount(actionKey.getUuid(key));
    await db.notifications.create({
      data: {
        user_uuid: uuid,
        message: "Account usurpation detected, account disabled, please contact kraaken."
      }
    })
    res.status(200);
    return res.json({
      message: "blocked account",
    });
  }
  res.status(401);
  return res.json({
    error: "",
    message: "wrong key",
  });
};
module.exports = usurpation;
