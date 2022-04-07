const Controller = require("$controllers");

module.exports = [
  /**
   * @Route : /login
   * @Method : post
   * cette route  permet de logger un user
   */
  {
    url: "/user/login",
    method: "post",
    func: [Controller["UserController@login"]],
  },

  /**
   *@Route : /user/register
   *@Method : post
   */
  {
    url: "/user/register",
    method: "post",
    func: [Controller["UserController@register"]],
    // perm: ["BANK_ADMIN", "OFFICE_ADMIN", "OFFICE_EMPLOYEE", "BANK_EMPLOYEE"],
  },

  /**
   *@Route : /user/getUser/{uuid}
   *@Method : get
   */
  {
    url: "/user/get-user/:uuid",
    method: "get",
    func: [Controller["UserController@getUser"]],
    functionName: "getUser",
    perm: ["*"],
  },

  /**
   *@Route : /user/logout
   *@Method : post
   */
  {
    url: "/user/logout",
    method: "post",
    func: [Controller["UserController@logout"]],
    functionName: "Logout",
    perm: ["*"],
  },
  /**
   *@Route : /user/checkUser
   *@Method : post
   */
  {
    url: "/user/checkUser",
    method: "post",
    func: [Controller["UserController@checkExisteUser"]],
    functionName: "checkExisteUser",
    perm: ["*"],
  },
  /**
   *cette route nous permet de recuperer l'ensenble des users
   *@Route : /user
   *@Method : get
   */
  {
    url: "/user",
    method: "get",
    func: [Controller["UserController@getAll"]],
    perm: ["*"],
  },
  /**
   * cette route nous permet d'activer le compte d'un utilisateur
   * @Route : /user/{action}/{uuid}
   * @Method : patch
   */
  {
    url: "/user/:action/:uuid",
    method: "patch",
    func: [Controller["UserController@stateAccount"]],
    perm: ["*"],
  },
  /**
   *cette route nous permet de modifier des information user
   *@Route : /user
   *@Method : patch
   */
  {
    url: "/user",
    method: "patch",
    func: [Controller["UserController@updateUser"]],
    perm: ["*"],
  },
];
