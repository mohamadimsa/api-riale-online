const Controller = require("$controllers");

module.exports = [
  /**
   * cette route nous permet d'ajouter un nouveau token  push notification
   * @param {string} token token push notification
   * @Route : /pushnotification/add/:token
   * @Method : post
   */
  {
    url: "/pushnotification/add/:token",
    method: "post",
    func: [Controller["PushNotificationController@addToken"]],
    functionName: "addToken",
    perm: ["*"],
  },
  /**
   * cette route nous permet de supprimer un twall nouveau token  push notification
   * @param {string} token token push notification
   * @Route : /pushnotification/delete/:token
   * @Method : post
   */
  {
    url: "/pushnotification/delete/:token",
    method: "post",
    func: [Controller["PushNotificationController@deleteToken"]],
    functionName: "delete",
  },
];
