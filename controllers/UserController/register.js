const db = require("$db");
const bcrypt = require("bcrypt");
const service_email = require("$services/Mail/index");
const { generateIdentifiant } = require("$services/function/utile");
const generator = require("generate-password");
const yup = require("yup");

const register = async (req, res) => {
  try {
    /**
     * @description Get user data from req. Body
     */
    const {
      name,
      forename,
      email,
      city,
      country,
      role,
      avatar,
      zipCode,
      address,
      countryPhoneNumber,
      birthday,
      phoneNumber,
    } = req.body;

    /**
     * @description Create a new Validator instance
     */
    const schema = yup.object().shape({
      name: yup.string().required(),
      forename: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string(),
      city: yup.string(),
      country: yup.string(),
      countryPhoneNumber: yup.string(),
      role: yup.string(),
      avatar: yup.string(),
      zipCode: yup.string(),
      address: yup.string(),
      birthday: yup.string(),
      phoneNumber: yup.string(),
    });

    await schema.validate({
      password: req.body.password,
      name: name,
      forename: forename,
      email: email,
      city: city,
      country: country,
      countryPhoneNumber: countryPhoneNumber,
      role: role,
      avatar: avatar,
      zipCode: zipCode,
      address: address,
      birthday: birthday,
      phoneNumber: phoneNumber,
    });

    /**
     * @description si le passsword existe pas on n'en genére un
     */
    const passwordGenarte = generator.generate({ length: 10, numbers: true });
    const password = req.body.password ? req.body.password : passwordGenarte;

    /**
     * @description Hash password to bcrypt
     * @type {bcrypt}
     */
    bcrypt.hash(password, 10, async (err, hash) => {
      /**
       * @description Creating user object
       * @type {{forename, name, email}}
       */
      const user = {
        name,
        forename,
        email,
        password: hash,
        address: address,
        city: city,
        country: country,
        role: req.body.role || '["ROLE_USER"]',
        id_user: generateIdentifiant(),
        birthday,
      };

      /**
       * @description try to insert user into db
       */
      await db.user.create({ data: user });

      /**
       * @description try to find inserted user
       */
      const userDB = await db.user.findUnique({ where: { email: user.email } });

      /**
       * @description return resource created status
       */
      res.status(201);

      // /**
      //  * @description sending identifiers to a user by email
      //  */
      // service_email.sendMail("welcome", "fr", [
      //   {
      //     email: user.email,
      //     password: password,
      //     identifiant: user.id_user,
      //     subject: "Première connexion",
      //     name: user.name,
      //   },
      // ]);

      /**
       * @description return user data
       */
      return res.send(userDB);
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Bad Request",
      errors:
        "Une erreur s'est produite lors de la création de l'utilisateur, veuillez vérifié si l'email n'est pas déjà associé a un compte.",
    });
  }
};

module.exports = register;
