const yup = require("yup");
const generator = require("generate-password");
const bcrypt = require("bcrypt");
const { createOffice } = require("$models/officeModel");
const { createEmployee } = require("$models/employeesModel");
const { createUser } = require("$models/userModel");
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
      email: yup.string().email().required(),
      user: yup
        .object()
        .shape({
          name: yup.string().required(),
          forename: yup.string().required(),
          email: yup.string().required(),
        })
        .required(),
    });

    await schema.validate({
      state: req.body.state,
      officeName: req.body.officeName,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      number_employees: req.body.number_employees,
      commentState: req.body.commentState,
      email: req.body.email,
      user: {
        name: req.body.user.name,
        forename: req.body.user.forename,
        email: req.body.user.email,
      },
    });

    const office = await createOffice({
      state: req.body.state,
      officeName: req.body.officeName,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      number_employees: req.body.number_employees,
      commentState: req.body.commentState,
      identification: "im" + generateIdentifiant(),
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

    const password = generator.generate({ length: 10, numbers: true });
    bcrypt.hash(password, 10, async (err, hash) => {
      const user = await createUser({
        name: req.body.user.name,
        forename: req.body.user.forename,
        email: req.body.user.email,
        password: hash,
        role: '["ROLE_USER"]'})
      

      if (!user) {
        return res.status(400).json({
          error: "insertion bd",
          message: "la création de l'utilisateur a echoué",
        });
      }

    let employee = await createEmployee({
        state : "active",
        identification_employees : "of"+generateIdentifiant(),
        email : req.body.email,
        role : '["OFFICE_ADMIN"]',
        office_uuid : office.uuid,
        user_uuid : user.uuid,
    });
    if(!employee){
        return res.status(400).json({
            error: "insertion bd",
            message: "la création de l'employee a echoué",
          });
    }

    console.log(employee);
    console.log(JSON.parse(req.role));
});
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
