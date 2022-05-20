const prisma = require("../../Models/Database/index");
const { strRandom } = require("$services/function/utile");
/**
 * cette function nous permert d'effectuer un virement
 * @param {*} data {from,to,amount,carte}
 * @param {*} createBy
 */
module.exports = function payement(data, createBy) {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$transaction(async (prisma) => {
        //on verifier si les compte existe
        const sender = await prisma.account.findUnique({
          where: { uuid: data.from },
          include: {
            user: true,
          },
        });

        const recipient = await prisma.account.findUnique({
          where: { uuid: data.to },
          include: {
            user: true,
          },
        });
        if (!sender || !recipient) {
          reject("échec du payement");
          throw new Error(`échec du payement`);
        } else if (sender.uuid == recipient.uuid) {
          reject("échec du payement");
          throw new Error(`échec du payement`);
        }
        console.log("sender : ", sender);
        console.log("recipient : ", recipient);
        // 1. Decremente le compte de l'envoyeur
        let accountSender = await prisma.account.update({
          data: {
            solde: {
              decrement: data.amount,
            },
          },
          where: {
            uuid: data.from,
          },
        });
        // on verifie que aprés le update le compte n'est pas négatif
        if (accountSender.solde < 0) {
          reject("le virement na pas pus abboutir solde insuffisante");
          throw new Error(` solde inssufisant`);
        }
        // 3. on credite le montant dans le compte du recepteur
        await prisma.account.update({
          data: {
            solde: {
              increment: data.amount,
            },
          },
          where: {
            uuid: data.to,
          },
        });
        //creation des historique lier au virement
        const reference = strRandom();

        try {
          await prisma.historicalOperation.create({
            data: {
              number_account: recipient.number_account,
              reference: reference,
              amount: data.amount,
              money: "fc",
              label: `Encaissement ${sender.user.forename} ${sender.user.name}`,
              createBy: createBy,
              state: "succes",
              comment_state: "",
              type: "credit",
            },
          });
          await prisma.historicalOperation.create({
            data: {
              number_account: sender.number_account,
              reference: reference,
              amount: data.amount,
              money: "fc",
              label: `achat carte chez ${recipient.user.forename} ${recipient.user.name}`,
              createBy: createBy,
              state: "succes",
              comment_state: "",
              type: "debit",
            },
          });

          resolve(true);
        } catch (error) {
          reject("une erreur c'est produite");
          throw new Error(`une erreur en interne c'est produite`);
        }
      });
    } catch (error) {}
  });
};
