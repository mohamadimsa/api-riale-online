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
];
