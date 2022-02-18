const db = require("$db");
const yup = require("yup");
const { createOffice } = require("$models/officeModel");
const { generateIdentifiant } = require("$services/function/utile");

const create = async (req, res) => {
  try {
    const schema = yup.object().shape({
      state: yup.string(),
      officeName: yup.string().required(),
      country: yup.string().required(),
      address: yup.string(),
      city: yup.string().required(),
      number_employees: yup.number().required().positive().integer(),
      commentState: yup.string(),
    });

    await schema.validate({
      state: req.body.state,
      officeName: req.body.officeName,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      number_employees: req.body.number_employees,
      commentState: req.body.commentState,
    });

    let office = await createOffice({
      state: req.body.state,
      officeName: req.body.officeName,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      number_employees: req.body.number_employees,
      commentState: req.body.commentState,
      identification: "off" + generateIdentifiant(),
      state: "en cours de validation",
      commentState:
        "en attente de validations du compte par le gérant de l'office",
    });

    



    if (!office) {
      return res.status(400).json({
        error: "insertion bd",
        message: "la création de l'office a echoué",
      });
    }

    console.log(office);
    console.log(JSON.parse(req.role));
  } catch (err) {
    console.log(err.toString());
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: err.name,
        message: err.message,
      });
    }
    res.status(500).send(err.toString());
  }
};

module.exports = create;
