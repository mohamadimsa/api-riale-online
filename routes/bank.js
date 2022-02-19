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
    perm: ['SUPERVISOR']
    
  },
];