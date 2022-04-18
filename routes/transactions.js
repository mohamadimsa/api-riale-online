const Controller = require("$controllers");

module.exports = [
  /**
   * cette route nous permet d'effectuer un virement
   * @Route : /virement
   * @Method : post
   */
  {
    url: "/virement",
    method: "post",
    func: [Controller["TransactionController@virement"]],
    functionName: "virement",
    perm: ["*"],
  },
];
