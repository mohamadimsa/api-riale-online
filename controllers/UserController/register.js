const db = require("$db");
const bcrypt = require("bcrypt");
const service_email = require("$services/Mail/index");
const generator = require("generate-password");
const yup = require("yup");

const register = async (req, res) => {
  /**
   * @description Get user data from req. Body
   */
  const { name, forename, email } = req.body;

  /**
   * @description Create a new Validator instance
   */
  const schema = yup.object().shape({
    name: yup.string().required(),
    forename: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required()
  })

  
    if (! await schema.validate({password: req.body.password, name: name, forename: forename, email: email})){
      return res.status(400).json({
        message: 'Bad Request',
        errors: schema.errors
      })
    }


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
      role: req.body.role || '["ROLE_USER"]',
    };

    try {
      /**
       * @description try to insert user into db
       */
      await db.user.create({ data: user });
    } catch (e) {
   
      /**
       * @description Return status 500
       */
      console.log(e);
      res.status(500);
      return res.send(
        "Une erreur s'est produite lors de la création de l'utilisateur, veuillez vérifié si l'email n'est pas déjà associé a un compte."
      );
    }

    /**
     * @description try to find inserted user
     */
    const userDB = await db.user.findUnique({ where: { email: user.email } });

    /**
     * @description return resource created status
     */
    res.status(201);

    /**
     * @description sending identifiers to a user by email
     */
    service_email.sendMail("welcome", "fr", [
      {
        email: user.email,
        password: password,
        identifiant: user.email,
        subject: "Première connexion",
        name: user.name,
      },
    ]);

    /**
     * @description return user data
     */
    return res.send(userDB);
  });
};

module.exports = register;
