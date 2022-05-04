const Controller = require("$controllers");

module.exports = [
  /**
   * @desciption cette route nous permet de cree un compte bancaire a un utilisateur
   * @Route : /account
   * @Method : post
   */
  {
    url: "/account",
    method: "post",
    func: [Controller["AccountController@create"]],
    functionName: "create",
    perm: ["SUPERVISOR"],
  },
  /**
   * @desciption cette route nous permet de recuperer l'essemble des compte d'un utilisateur
   * @Route : /account
   * @Method : get
   * uuid (utilisateur)
   */
  {
    url: "/accounts",
    method: "get",
    func: [Controller["AccountController@getAll"]],
    functionName: "getAll",
    perm: ["SUPERVISOR"],
  },
  /**
   * @desciption cette route nous permet de recuperer l'essemble des compte d'un utilisateur
   * @Route : /account
   * @Method : get
   * uuid (utilisateur)
   */
  {
    url: "/accounts/:uuid",
    method: "get",
    func: [Controller["AccountController@getAccountUser"]],
    functionName: "getAccountUser",
    perm: ["SUPERVISOR"],
  },
  /**
   * @desciption cette route nous permet de recuperer les compte liée a un utilisateur
   * @Route : /account/{uuid}
   * @Method : get
   * uuid (compte)
   */
  {
    url: "/account/:uuid",
    method: "get",
    func: [Controller["AccountController@getAccount"]],
    functionName: "getAccount",
    perm: ["SUPERVISOR"],
  },
];
