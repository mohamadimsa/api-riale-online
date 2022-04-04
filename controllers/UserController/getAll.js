const db = require("$db");

const getUser = async (req, res) => {
  try {
    const user = await db.user.findMany();
    res.status(200);
    return res.send(user);
  } catch (err) {
    res.status(500);
    return res.send("Server Error");
  }
};

module.exports = getUser;
