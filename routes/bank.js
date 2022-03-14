const Controller = require("$controllers");

module.exports = [
  /**
   * cette route nous permet de cree une bank
   * @Route : /bank
   * @Method : post
   */
  {
    url: "/bank",
    method: "post",
    func: [Controller["BankController@create"]],
    functionName: "create",
    perm: ["SUPERVISOR"],
  },
  /**
   * cette route nous permet de recuperer tous les bank dispo
   * @Route :/bank
   * @Method ; get
   */
  {
    url: "/banks",
    method: "get",
    func: [Controller["BankController@getAll"]],
    functionName: "getAll",
    perm: ["SUPERVISOR"],
  },
];
