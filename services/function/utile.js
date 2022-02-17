const { date } = require("yup/lib/locale");

module.exports = {
  strRandom,
  convertTimeStamp,
  checkRole,
  generateIdentifiant,
  createNumeroAccount,
};
/**
 * permet de generer une chaine de caracterer
 * @param {objet}
 * @returns
 */
function strRandom(o) {
  var a = 10,
    b = "abcdefghi-jklmnop269762qr%stuvwxyz",
    c = "",
    d = 0,
    e = "" + b;
  if (o) {
    if (o.startsWithLowerCase) {
      c = b[Math.floor(Math.random() * b.length)];
      d = 1;
    }
    if (o.length) {
      a = o.length;
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase();
    }
    if (o.includeNumbers) {
      e += "1234567890";
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)];
  }
  return c;
}

/**
 * cette fonction permet convertir une espression en timestamp
 * @param {string} exp
 * @example "4J" pour 4 jour , "72h" pour 72 heure
 * @return bolean || int
 */
function convertTimeStamp(exp) {
  let indicateur = exp.split("").reverse().join("").substr(0, 1).toLowerCase();
  if (indicateur == "m" || indicateur == "h" || indicateur == "j") {
    switch (indicateur) {
      case "h":
        indicateur = 3600000;
        break;
      case "m":
        indicateur = 60000;
        break;
      case "j":
        indicateur = 86400000;
        break;
    }
    let chiffre = exp
      .split("")
      .reverse()
      .join("")
      .substr(1)
      .split("")
      .reverse()
      .join("");
    return chiffre * indicateur;
  }
  return false;
}

/**
 * @param {array} roleRoute role autoriser pour la route
 * @param {array} roleUser  role user
 * cette fonction nous permet de verifier si un ulisateur a bien les droit d'accees a une route
 * elle prend aussi le cas ou un utilisateur peut avoir plusieur role
 */
function checkRole(roleRoute, roleUser) {
  // au depart on fixe l'autorisation a une false
  let authorization = false;
  //on boucle sur les role que pocede l'utilisateur
  for (let index = 0; index < roleUser.length; index++) {
    let result = roleRoute.filter((word) => word == roleUser[index]);
    //si l'user pocéde au moin une permission qui match avec les autorisation de la route
    //on passe authorization a true
    if (result.length > 0) {
      index = roleUser.length;
      authorization = true;
    }
  }
  return authorization;
}

/**
 * cette fonction nous permet cree un numero client user unique 13 caractére
 */
function generateIdentifiant() {
  let identifiant = new Date().getTime().toString();
  identifiant = identifiant.substr(3);
  identifiant = reverseString(identifiant.substr(7)) + identifiant;
  identifiant = identifiant.substring(0, 12);
  return identifiant;
}

function createNumeroAccount() {
  const alphabet = "ABCDEFGHIGKLMOPQRSTVWXYZ";
  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
  let numberAccount = new Date().getTime().toString();
  numberAccount = numberAccount.substr(2);
  numberAccount =
    reverseString(numberAccount.substr(6)) + randomCharacter + numberAccount;

  numberAccount = numberAccount.substring(0, 9);

  return numberAccount;
}
/**
 * cette fonction permet de reverse une chaine de caracterer
 * @param {STRING} str
 * @returns string
 */
function reverseString(str) {
  return str.split("").reverse().join("");
}
