const db = require("$db");
const yup = require("yup");
const {
  createNumeroAccount,
  generateCard,
} = require("$services/function/utile");
const {
  historiqueOperation,
} = require("$services/bancaire/historiqueOperation");
const bcrypt = require("bcrypt");
const { cryptage } = require("$services/function/chifrement");
const jwt = require("jsonwebtoken");

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
       * ouverture compte principal
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
          /**
           * creation et enregistrement de la carte
           */
          let cardPrincipal = generateCard();
          console.log("carte principal", cardPrincipal);

          recapAccount.cardPrincipal = await db.cards.create({
            data: {
              account_uuid: recapAccount.principal.uuid,
              user_uuid: uuid,
              /**
               * trouver une façon de pouvoir envoyer le mot de passe
               * de la carte a l'utilisateur
               */
              password: await bcrypt.hash("1710", 10),
              exp: await bcrypt.hash(cardPrincipal.exp, 10),
              cvv: await bcrypt.hash(cardPrincipal.cvv, 10),
              number: cardPrincipal.number,
              state: "disable",
              commentState: "en attente de la validation du compte",
              forcebloqued: true,
              type: "clasic",
            },
          });
          const token = jwt.sign(
            {
              idCard: recapAccount.cardPrincipal.uuid,
            },
            "v6sb89x6s33b9dkh"
          );
          console.log("cryp principal", cryptage(token));
          await db.settingcards.create({
            data: {
              card_uuid: recapAccount.cardPrincipal.uuid,
              payementOnline: true,
              nocontact: true,
            },
          });

          /**
           * historique de lier au debot
           */
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

      /**
       * ouverture compte epargne
       */
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
          /**
           * historique lier au depot
           */
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
      /**
       * ouverture compte pro
       */
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
        /**
         * creation et enregistrement de la carte
         */
        let cardPro = generateCard();
        console.log("carte pro", cardPro);

        recapAccount.cardPro = await db.cards.create({
          data: {
            account_uuid: recapAccount.principal.uuid,
            user_uuid: uuid,
            /**
             * trouver une façon de pouvoir envoyer le mot de passe
             * de la carte a l'utilisateur
             */
            password: await bcrypt.hash("1710", 10),
            exp: await bcrypt.hash(cardPro.exp, 10),
            cvv: await bcrypt.hash(cardPro.cvv, 10),
            number: cardPro.number,
            state: "disable",
            commentState: "en attente de la validation du compte",
            forcebloqued: true,
            type: "pro",
          },
        });
        const token = jwt.sign(
          {
            idCard: recapAccount.cardPro.uuid,
          },
          "v6sb89x6s33b9dkh"
        );
        console.log("cryp pro", cryptage(token));

        await db.settingcards.create({
          data: {
            card_uuid: recapAccount.cardPro.uuid,
            payementOnline: true,
            nocontact: true,
          },
        });
        /**historique lier au depot */
        historiqueOperation({
          number_account: recapAccount.pro.number_account,
          amount: pro.depot,
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
