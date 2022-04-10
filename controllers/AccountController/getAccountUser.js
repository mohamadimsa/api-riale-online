const db = require("$db");
const yup = require("yup");

const getAccountUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    const schema = yup.object().shape({
      uuid: yup.string().uuid().required(),
    });

    if (!(await schema.validate({ uuid: uuid }))) {
      return res.status(400).json({
        message: "Bad Request",
        errors: schema.errors,
      });
    }

    const account = await db.account.findMany({
      where: {
        user_uuid: uuid,
      },
    });

    if (account) {
      res.status(200);
      return res.json(account);
    }
    res.status(500);
    res.json({
      error: "",
      message: "une erreur c'est produite",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      error: "",
      message: "une erreur c'est produite",
    });
  }
};

module.exports = getAccountUser;
