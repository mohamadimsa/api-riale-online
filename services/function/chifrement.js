var CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
require("dotenv").config();
/**
 *cette fonction nous permet de chriffe un objet ou une chaine de caracterer
 * @param {*} data
 * @returns
 */
function cryptage(data) {
  if (typeof isObjet == "object") {
    return CryptoJS.MD5.encrypt(
      JSON.stringify(data),
      "fB[VE{@vpS(W6$f$$?$#M.$}rnOKlu"
    ).toString();
  }
  return CryptoJS.AES.encrypt(
    data,
    "fB[VE{@vpS(W6$f$$?$#M.$}rnOKlu"
  ).toString();
}

/**
 *cette fonction nous permet de déchriffe un objet ou une chaine de caracterer chriffrer
 * @param {*} data
 * @returns
 */
function decryptage(data, secret) {
  if (typeof isObjet == "object") {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  var bytes = CryptoJS.AES.decrypt(
    data,
    secret ? secret : "fB[VE{@vpS(W6$f$$?$#M.$}rnOKlu"
  );
  return bytes.toString(CryptoJS.enc.Utf8);
}
module.exports = {
  cryptage,
  decryptage,
};

// bcrypt.hash("1710", 10, async (err, hash) => {
//   console.log(hash);
// });
