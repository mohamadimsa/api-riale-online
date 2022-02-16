const Sentry = require("$sentry");
const db = require('$db')

const Logout = async (req, res) => {
  try {
      if (req.session.screen){
          await db.ipAddress.update({
              where: {
                  uuid: req.session.screen.uuid
              },
              data: {
                  isConnected: false
              }
          })
          await req.session.destroy();
      }
      res.status(200);
      return res.send('Logged out');
  } catch (e) {
    /**
     * @description Sending error to sentry
     */
    Sentry.captureException(e);
    /**
     * @description sending error to client.
     */
    res.status(500);
    return res.send("Server Error");
  }
};

module.exports = Logout;
