const fs = require("fs");
const jwt = require("jsonwebtoken");
const Sentry = require("$sentry");
const { uuid } = require("uuidv4");
const { checkRole } = require("$services/function/utile");

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
  console.log(req.headers.host)
  if (!req.headers.apikey) {
    res.status(403);
    return res.json({
      error: "Accès refusé",
      message: "vous n'etes pas autoriser a utiliser l'api",
    });
  }
  

  let perm = associationObj[req.method.toLowerCase()][req.route.path].perm;
  //on verifie si une pemission et requise si c le cas on continue le script
  if (perm === undefined || perm === -1) {
    return next();
  } else {
    //on recupere le token
    console.log(req.headers.apikey);
    let auth = req.headers.authorization;
    //si le token n'hesiste pas on renvois un message d'erreur
    if (!auth) {
      return res.status(401).send("Must Auth");
    } else if (perm.includes("*", 0)) {
      let token = auth.split(" ");
      jwt.verify(token[1], process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          res.status(400).send("Bad request: Token invalid");
          //on verifie que le token a bien un role autoriser
        }
        req.user = payload.uuid;
        req.role = payload.role;
        return next();
      });
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
            req.user = payload.uuid;
            req.role = payload.role;
            return next();
          } else {
            res.status(401).send("Unauthorized");
          }
        });
      }
    }
  }
};
