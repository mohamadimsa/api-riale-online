const jsonDoc = require("$root/swagger.json")
const docs = async (req, res) => {
         res.status(200)
         res.send(JSON.stringify(jsonDoc))
};
module.exports = docs;