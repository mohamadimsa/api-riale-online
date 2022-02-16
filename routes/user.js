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
    url:"/user/register",
    method: "post",
    func : [Controller["UserController@register"]]
  },

  /**
   *@Route : /user/getUser/{uuid}
   *@Method : get
   */
  {
    url:"/user/get-user/:uuid",
    method: "get",
    func : [Controller["UserController@getUser"]],
    functionName: 'getUser',
    perm: ['*']
  },

  /**
   *@Route : /user/logout
   *@Method : post
   */
  {
    url:"/user/logout",
    method: "post",
    func : [Controller["UserController@logout"]],
    functionName: 'Logout',
    perm: ['*'],
  },
];
