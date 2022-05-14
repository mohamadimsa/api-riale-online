const db = require("$db");
const { createNumeroAccount, strRandom } = require("$services/function/utile");
/**
 * cette fonction nous permet d'insert les historique des operation
 * (virement ,depot ,prelevement , payement etc..)
 * @param {*} data
 *
 */
const historiqueOperation = async (data) => {
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
    } = data
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
          comment_state: comment_state ? comment_state : null,
          type: "credit",
        },
      });
    }


  } catch (error) {
    console.log(error);
  }
};

module.exports = { historiqueOperation };
