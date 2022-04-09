const db = require("$db");
const yup = require("yup");
const { createNumeroAccount } = require("$services/function/utile");
const {
  historiqueOperation,
} = require("$services/bancaire/historiqueOperation");

const create = async (req, res) => {
  try {
    const { principal, pro, epargne, uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({
        error: "",
        message: "bad request",
      });
    }

    let recapAccount = {
      principal: undefined,
      epargne: undefined,
      pro: undefined,
    };

    const user = await db.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (user) {
      const account = await db.account.findMany({
        where: {
          user_uuid: uuid,
        },
      });
      /**
       * afin d'eviter les doublon de compte on verifie l'utilisateur ne possede daja pas le type de compte
       */
      account.map((compte, key) => {
        if (compte.type == "principal" && principal) {
          recapAccount.principal = compte;
        }
        if (compte.type == "epargne" && epargne) {
          recapAccount.epargne = compte;
        }
        if (compte.type == "pro" && pro) {
          recapAccount.pro = compte;
        }
      });

      /**
       * on fait l'ouverture des compte seulment si on a de la data lier
       */
      if (principal && uuid) {
        if (recapAccount.principal) {
          delete recapAccount.principal;
        } else {
          recapAccount.principal = await db.account.create({
            data: {
              number_account: createNumeroAccount(),
              type: "principal",
              createBy: req.user,
              user_uuid: uuid,
              state: "ouverture",
              solde: principal.depot,
              comment_state:
                "demande d'ouverture de compte en attente de validation",
            },
          });
          historiqueOperation({
            operation: {
              number_account: recapAccount.principal.number_account,
              amount: principal.depot,
              money: "fc",
              label: "depot ouverture compte ",
              createBy: req.user,
              state: "succes",
              comment_state: "",
              type: "depot",
            },
          });
        }
      }

      if (epargne && uuid) {
        if (recapAccount.epargne) {
          delete recapAccount.epargne;
        } else {
          recapAccount.epargne = await db.account.create({
            data: {
              number_account: createNumeroAccount(),
              type: "epargne",
              createBy: req.user,
              user_uuid: uuid,
              state: "ouverture",
              solde: epargne.depot,
              comment_state:
                "demande d'ouverture de compte en attente de validation",
            },
          });
          historiqueOperation({
            number_account: recapAccount.epargne.number_account,
            amount: epargne.depot,
            money: "fc",
            label: "depot ouverture compte ",
            createBy: req.user,
            state: "succes",
            comment_state: "",
            type: "depot",
          });
        }
      }
      if (pro && uuid) {
        if (recapAccount.pro) {
          delete recapAccount.pro;
        } else {
          recapAccount.pro = await db.account.create({
            data: {
              number_account: createNumeroAccount(),
              type: "pro",
              createBy: req.user,
              user_uuid: uuid,
              state: "ouverture",
              solde: pro.depot,
              comment_state:
                "demande d'ouverture de compte en attente de validation",
            },
          });
        }
        historiqueOperation({
          number_account: recapAccount.pro.number_account,
          amount: epargne.pro,
          money: "fc",
          label: "depot ouverture compte ",
          createBy: req.user,
          state: "succes",
          comment_state: "",
          type: "depot",
        });
      }

      if (
        !recapAccount.principal &&
        !recapAccount.pro &&
        !recapAccount.epargne
      ) {
        res.status(401);
        return res.json({
          error: "",
          message:
            "le client possede deja l'ensemple des compte qui souhaite ouvrir",
        });
      }
      res.status(201);
      return res.json(recapAccount);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "",
      message: "serveur error",
    });
  }
};

module.exports = create;
