const Controller = require("$controllers");

module.exports = [
  /**
   * cette route nous permet de cree un office
   * @Route : /office
   * @Method : post
   */
  {
    url: "/office",
    method: "post",
    func: [Controller["OfficeController@create"]],
    functionName: "create",
    perm: ['BANK_ADMIN','SUPERVISOR']
    
  },
];
