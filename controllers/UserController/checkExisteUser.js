const db = require("$db");
const yup = require("yup");

const CheckExisteUser = async (req, res) => {
  try {
    /**
     * element dans le req.body
     */
    const { name, forename, email, birthday } = req.body;
    const schema = yup.object().shape({
      email:
        !forename || !birthday || !name
          ? yup.string().email().required()
          : yup.string().email(),
      forename: name || birthday ? yup.string().required() : yup.string(),
      name: forename || birthday ? yup.string().required() : yup.string(),
      birthday: forename || name ? yup.string().required() : yup.string(),
    });

    await schema.validate({
      name: name,
      forename: forename,
      email: email,
      birthday: birthday,
    });

    /**
     * check si une addresse email est existant
     */
    if (!name && !forename && !birthday) {
      let user = await db.user.findUnique({ where: { email: email } });
      if (user) {
        res.status(200);
        return res.json({
          userExiste: {
            uuid: user.uuid,
            name: user.name + " " + user.forename,
          },
        });
      }
      return res.json({
        userExiste: false,
      });
    }
    let user = await db.user.findFirst({
      where: {
        AND: {
          name: name,
          forename: forename,
          birthday: birthday,
        },
      },
    });

    if (user) {
      res.status(200);
      return res.json({
        userExiste: { uuid: user.uuid, name: user.name + " " + user.forename },
      });
    }
    return res.json({
      userExiste: false,
    });
  } catch (error) {
    console.log(error.toString());
    return res.status(400).json({
      message: "error server",
      errors: error.toString(),
    });
  }
};

module.exports = CheckExisteUser;
