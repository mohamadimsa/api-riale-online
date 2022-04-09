const db = require("$db");
const { createNumeroAccount, strRandom } = require("$services/function/utile");
/**
 * cette fonction nous permet d'insert les historique des operation
 * (virement ,depot ,prelevement , payement etc..)
 * @param {*} data
 *
 */
const historiqueOperation = async (data) => {
    console.log(data)
  try {
    /**
     * initiation des data qu'on a besion
     */
    const {
      number_account,
      type,
      amount,
      label,
      createBy,
      state,
      comment_state,
    } = data.operation;
    const reference = strRandom();
    if (type == "depot") {
      await db.historicalOperation.create({
        data: {
          number_account: number_account,
          reference: reference,
          amount: amount,
          money: "fc",
          label: label ? label : null,
          createBy: createBy,
          state: state,
          comment_state: comment_state?comment_state:null,
          type: "credit",
        },
      });
    }

    if (type == "virement") {
      await db.historicalOperation.create({
        data: {
          number_account: number_account,
          reference: reference,
          amount: amount,
          money: "fc",
          label: label ? label : null,
          createBy: createBy,
          state: state,
          comment_state: comment_state,
          type: "credit",
        },
      });
      await db.historicalOperation.create({
        data: {
          number_account: number_account,
          reference: reference,
          amount: amount,
          money: "fc",
          label: label ? label : null,
          createBy: createBy,
          state: state,
          comment_state: comment_state,
          type: "debit",
        },
      });

      await db.historicalOperation.create({
        data: {
          number_account: number_account,
          reference: reference,
          amount: amount,
          money: "fc",
          label: label ? label : null,
          createBy: createBy,
          state: state,
          comment_state: comment_state,
          type: "debit",
        },
      });

      await db.transfer.create({
        data: {
          reference: reference,
          type: data.virement.type
            ? data.virement.type
            : "virement occationelle",
          message: data.virement.message ? data.virement.message : null,
          creditor: data.virement.creditor,
          debtor: data.virement.debtor,
          createby: createBy,
          amount: amount,
          money: "fc",
          state: data.virement.state,
          comment_state: data.virement.comment_state,
          validateby: validateby.virement.validateby,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { historiqueOperation };
