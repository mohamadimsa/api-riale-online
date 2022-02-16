const db = require("../../Models/Database/index");
const fonction = require("./utile");
const code = "Xw2Hy%My2sf";

/**
 * cette fonction nous permet de genérer une ActionKey
 * @param {string} userId uuid
 * @param {string} action
 * @returns promise
 */
const generateActionKey = async (userId, action, time = "15m") => {
  // genere une chaine de charactere
  let strkey = fonction.strRandom({
    includeUpperCase: true,
    includeNumbers: true,
    length: 34,
    startsWithLowerCase: true,
  });
  let temps = fonction.convertTimeStamp(time)
    ? fonction.convertTimeStamp(time)
    : 900000;
  let exp = new Date().getTime() + temps;
  //creation de la actionKey
  let uuid = userId.replaceAll("-", "%");
  strkey = uuid + code + strkey;
  const actionKey = {
    key: strkey,
    exp: exp,
    action: action,
    user: userId,
    keyUrl: encodeURI(strkey),
  };
  await purgeKey(userId, action);
  // ajout de la key en db
  const update = await db.actionKey.create({
    data: {
      key: strkey,
      exp: exp,
      action: action,
      user: userId,
      keyUrl: encodeURI(strkey),
    },
  });

  return actionKey;
};
/**
 * permet de supprimer une action key
 * @param {string} sn
 */
const deleteActionKey = async (sn) => {
  await db.actionKey.delete({
    where: {
      sn: sn,
    },
  });
};

/**
 * @param {string} key
 * @param {action} action
 * verifie la validiter de l'actionKey
 * @returns promise
 */
const isValidActionKey = async (key, action) => {
  const user = await db.actionKey.findUnique({
    where: {
      key: key,
    },
  });
  //on verifie que la cle et identique a celle en db
  if (user) {
    let curentTime = new Date().getTime();
    // on verifie que la cle na pas expirer
    if (curentTime < user.exp && user.action == action) {
      //en cas d'usurpation on supprime toutes action par securiter
      if (user.action == "usurpation") {
        await db.actionKey.deleteMany({
          where: {
            user: user.user,
          },
        });
      }
      //on suprime la clé car si on fait la verif ce que le lien a etait utiliser
      await deleteActionKey(user.sn);
      return true;
    }
  }
  return false;
};

/**
 * @param {String} key
 * pemet de recuperer l'uuId dun user dans l'action key
 * */
function getUuid(key) {
  if (typeof key == "string") {
    let decriptKey = key.split(code);
    let uuid = decriptKey[0].replaceAll("%", "-");
    return uuid;
  }
  return "";
}

/**
 * permet de decoder l'url et recuperer la keyAction
 * @param {object} req la requette
 * @returns la keyAction decoder
 */
const getKeyUrl = (req) => {
  const keyDecode = decodeURI(req.path);
  let decriptKey = keyDecode.split("/");
  for (let index = 0; index < decriptKey.length; index++) {
    const element = decriptKey[index];
    if (element.length > 30) {
      decriptKey = element;
      return element;
    }
  }
  return false;
};

async function purgeKey(uuid, action) {
  let allKeyUser = await db.actionKey.findMany({
    where: {
      user: uuid,
    },
  });
  let curentTime = new Date().getTime();
  await allKeyUser.map((element) => {
    // on verifier si les keys non pas experer si c le cas on le supprime
    if (element.exp > curentTime || element.action == action) {
      db.actionKey.delete({
        where: {
          user: element.user,
        },
      });
    }
  });
}
module.exports = {
  getUuid,
  isValidActionKey,
  generateActionKey,
  getKeyUrl,
};
