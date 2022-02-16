const fs = require("fs");
const jwt = require("jsonwebtoken");
const Sentry = require("$sentry");

let associationObj = {
  get: {},
  post: {},
  delete: {},
  patch: {},
  put: {},
};

module.exports = (app) => {
  fs.readdirSync(__dirname)
    .filter((filename) => filename !== "index.js")
    .forEach((file) => {
      require("./" + file).forEach((route) => {
        associationObj[route.method.toLowerCase()][route.url] = route;
        //Ajout de chaque objet
        try {
          app[route.method.toLowerCase()](route.url, [
            checkUser,
            ...route.func,
          ]);
        } catch (e) {
          Sentry.captureException(e);
          throw new Error(
            `@Route("${route.url}") with method @Method("${route.functionName}") Not Found in file : @file("${__dirname}/${file}")`
          );
        }
      });
    });
};

const checkUser = (req, res, next) => {
  let perm = associationObj[req.method.toLowerCase()][req.route.path].perm;
  //on verifie si une pemission et requise si c le cas on continue le script
  if (perm === undefined || perm === -1) {
    return next();
  } else {
    //on recupere le token
    let auth = req.headers.authorization;
    //si le token n'hesiste pas on renvois un message d'erreur
    if (!auth) {
      return res.status(401).send("Must Auth");
    } else if (perm.includes('*', 0)) {
      return next();
    } else {
      let token = auth.split(" ");
      //on verifie bien qu'on a bearer et le token sinn accee refuser
      if (token.length !== 2) {
        return res.status(401).send("Must Auth");
      } else {
        //on verifie si le token et valide
        jwt.verify(token[1], process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            Sentry.captureException(err);
            res.status(400).send("Bad request: Token invalid");
            //on verifie que le token a bien un role autoriser
          } else if (checkRole(perm, JSON.parse(payload.role))) {
            return next();
          } else {
            res.status(401).send("Unauthorized");
          }
        });
      }
    }
  }
};

/**
 *
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
