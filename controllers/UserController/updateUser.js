const db = require("$db");
const yup = require("yup");

const UpdateUser = async (req, res) => {
  try {
    //retpurn -1 si le role supervisor n'hesiste pas
    const {
      name,
      forename,
      email,
      city,
      country,
      zipCode,
      address,
      birthday,
      uuid,
    } = req.body;
    let supervior = req.role.indexOf("SUPERVISOR");

    /**
     * @description on peut update les information d'un utilisateur seulment
     * si on n'est supervisor
     */
    const userUuid = supervior !== -1 ? uuid : req.uuid;

    const schema = yup.object().shape({
      name: yup.string().required(),
      forename: yup.string().required(),
      email: yup.string().email().required(),
      city: yup.string().required(),
      country: yup.string().required(),
      //   zipCode: yup.string().required(),
      address: yup.string().required(),
      birthday: yup.string().required(),
      uuid: yup.string().uuid(),
    });
    try {
      await schema.validate({
        name: name,
        forename: forename,
        email: email,
        city: city,
        country: country,
        //zipCode: zipCode,
        address: address,
        birthday: birthday,
        uuid: uuid,
      });
    } catch (error) {
      res.status(400);
      console.log(error);
      return res.json({
        error: "",
        message: "bad request",
      });
    }
    //on verifie que l'uuid renseigner est bien celui d'un utilisateur existant
    const user = await db.user.findUnique({ where: { uuid: userUuid } });
    if (user) {
      //pour optimiser les requette on le fait seulment si l'email et different
      if (user.email !== email) {
        if (await db.user.findUnique({ where: { email: email } })) {
          res.status(400);
          return res.json({
            error: "4326",
            message: "l'adresse email est deja attribuer a un utilisateur",
          });
        }
        /**
         * mise a jour de l'addresse email
         */
        if (
          !(await db.user.update({
            where: { uuid: user.uuid },
            data: { email: email },
          }))
        ) {
          res.status(500);
          return res.json({
            error: "",
            message: "une erreur c'est produite veuiller réessayer",
          });
        }
      }

      const data =
        supervior != -1
          ? {
              name: name,
              forename: forename,
              city: city,
              country: country,
              //zipCode: zipCode,
              address: address,
              birthday: birthday,
            }
          : {
              city: city,
              country: country,
              //zipCode: zipCode,
              address: address,
            };
      /**
       * mise a jour info user
       */
      if (
        !(await db.user.update({
          where: { uuid: user.uuid },
          data,
        }))
      ) {
        res.status(500);
        return res.json({
          error: "",
          message: "une erreur c'est produite veuiller réessayer",
        });
      }
    }

    res.status(200);
    return res.json({
      message: "les modification on bien etait prise en compte",
    });
  } catch (err) {
    res.status(500);
    return res.json({
      error: "",
      message: "une erreur c'est produite veuiller réessayer",
    });
  }
};

module.exports = UpdateUser;
