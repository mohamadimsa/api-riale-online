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
      comment :null
    },
  });
};

const disableAccount = async (uuid, comment) => {
  return await db.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      isBanned: false,
      isActive: false,
      isSuspended: false,
      comment: comment,
    },
  });
};

const banishAccount = async (uuid, comment) => {
  return await db.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      isBanned: true,
      isActive: true,
      isSuspended: false,
      comment: comment,
    },
  });
};

const suspendAccount = async (uuid, comment) => {
  return await db.user.update({
    where: {
      uuid: uuid,
    },
    data: {
      isBanned: false,
      isActive: true,
      isSuspended: true,
      comment: comment,
    },
  });
};

module.exports = {
  activeAccount,
  disableAccount,
  suspendAccount,
  banishAccount,
};
