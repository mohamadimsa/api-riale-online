const db = require("$db");
const yup = require("yup");


const getAccount = async (req, res) => {
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

    const account = await db.account.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (account) {
      let data = {
        account: account,
        operation: null,
      };

      data.operation = await db.historicalOperation.findMany({
        where: {
          number_account: account.number_account,
        },
      });

      res.status(200);
      return res.json(data);
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

module.exports = getAccount;
