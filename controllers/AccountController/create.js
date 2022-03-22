const db = require("$db");
const yup = require("yup");
const { createNumeroAccount } = require("$services/function/utile");

const create = async (req, res) => {
  /**
   * @description liste des data qu'on prend en compte dans le req.body
   */
  const { type, user_uuid, state, solde } = req.body;

  /**
   * @description definition des type souhaiter
   */
  const schema = yup.object().shape({
    user_uuid: yup.string().uuid().required(),
    type: yup.string(),
    state: yup.string(),
    solde: yup.number(),
  });
  /**
   * @description on check si les variable sont bien au format souhaiter
   */
  try {
    await schema.validate({
      user_uuid: user_uuid,
      type: type,
      state: state,
      solde: solde,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Bad Request",
      errors: schema.errors,
    });
  }

  const account = {
    number_account: createNumeroAccount(),
    type: type ? type : "courant",
    createBy: user_uuid,
    user_uuid: user_uuid,
    state: state ? state : "active",
    solde: solde ? solde : 0,
  };

  db.account
    .create({ data: account })
    .then((response) => {
      res.status(201).json({
        data: response,
      });
    })
    .catch((e) => {
      console.log(e.toString());
      res.status(500).json({
        error: "",
        message: "serveur error",
      });
    });
};

module.exports = create;
