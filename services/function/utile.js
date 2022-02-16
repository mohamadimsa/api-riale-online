module.exports = {
  strRandom,
  convertTimeStamp
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
function convertTimeStamp (exp) {
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
    let chiffre = exp.split("").reverse().join("").substr(1).split("").reverse().join("");
    return  chiffre*indicateur;
  }
  return false;
};

