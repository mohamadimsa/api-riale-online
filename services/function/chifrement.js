var CryptoJS = require("crypto-js");

/**
 *cette fonction nous permet de chriffe un objet ou une chaine de caracterer
 * @param {*} data
 * @returns
 */
function cryptage(data) {
  if (typeof isObjet == "object") {
    return CryptoJS.AES.encrypt(
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
function decryptage(data) {
  if (typeof isObjet == "object") {
    let bytes = CryptoJS.AES.decrypt(data, "fB[VE{@vpS(W6$f$$?$#M.$}rnOKlu");
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  var bytes = CryptoJS.AES.decrypt(data, "fB[VE{@vpS(W6$f$$?$#M.$}rnOKlu");
  return bytes.toString(CryptoJS.enc.Utf8);
}
module.exports = {
  cryptage,
  decryptage,
};
