const accountSid = "ACb46b5624f40c9e7357cd08442f17c1a2";
const authToken = "5786f324fc351c49586b6a7c9a78711d";
const client = require("twilio")(accountSid, authToken);

module.exports = {
  /**
   * cette fonction permet d'envoyer un sms 
   * @param {string} message 
   * @param {string} phoneNumber 
   */
  sendSms: (message, phoneNumber) => {
    client.messages
      .create({
        body: message,
        from: "+18508188408",
        to: phoneNumber,
      })
      .then((message) => console.log(message.sid))
      .catch((e) => console.log(e));
  },
};

