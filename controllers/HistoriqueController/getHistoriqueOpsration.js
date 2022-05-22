const db = require("$db");
const yup = require("yup");

const getHistoriqueOpsration = async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log(uuid);
    const schema = yup.object().shape({
      uuid: yup.string().required(),
    });

    if (!(await schema.validate({ uuid: uuid }))) {
      return res.status(400).json({
        message: "Bad Request",
        errors: schema.errors,
      });
    }

    const historique = await db.historicalOperation.findMany({
      where: {
        number_account: uuid,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(historique);
    if (historique) {
      res.status(200);
      return res.send(await trieHistorique(historique));
    }

    return res.status(404).json({
      message: "Bad Request",
    });
  } catch (err) {
    res.status(500);
    console.log(err);
    return res.send("Server Error");
  }
};

module.exports = getHistoriqueOpsration;

/**
 * cette function nous permet de faire un trie des operation pour avoir un traitement plus rapide coter front
 * @param {array} data
 * @returns
 */
async function trieHistorique(data) {
  let historisue = [];
  let indexHistorique = 0;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const d = new Date(element.createdAt);
    let day = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    if (index == 0) {
      historisue.push({
        date: day,
        historique: [element],
      });
    }
    if (historisue[indexHistorique].date == day) {
      historisue[indexHistorique].historique.push(element);
    } else if (historisue[indexHistorique].date != day) {
      indexHistorique = indexHistorique + 1;
      historisue.push({
        date: day,
        historique: [element],
      });
    }
  }
  return historisue;
}
