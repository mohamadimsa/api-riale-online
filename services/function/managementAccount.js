const db = require("$db");

const activeAccount = async (uuid) => {
 return await db.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      isBanned: false,
      isActive: true,
      isSuspended: false,
    },
  });
};

const disableAccount = async (uuid) => {
 return await db.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      isBanned: true,
      isActive: false,
      isSuspended: true,
    },
  });
};

const banishAccount = async (uuid) => {
 return await db.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      isBanned: true,
      isActive: false,
      isSuspended: false,
    },
  });
};

const suspendAccount = async (uuid) => {
  return await db.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      isBanned: false,
      isActive: false,
      isSuspended: true,
    },
  });
};

module.exports = {
  activeAccount,
  disableAccount,
  suspendAccount,
  banishAccount,
};
