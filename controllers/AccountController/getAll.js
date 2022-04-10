const db = require("$db");
const yup = require("yup");

const getAll = async (req, res) => {
  try {
    const account = await db.account.findMany();

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

module.exports = getAll;
