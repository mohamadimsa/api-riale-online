const db = require("$db");
const yup = require("yup");

const create = async (req, res) => {
  try {
  } catch (err) {
    res.status(500);
    return res.send("Server Error");
  }
};

module.exports = create;
