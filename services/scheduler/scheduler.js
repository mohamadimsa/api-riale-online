const cron = require("node-cron");
const { resolve } = require("path");

/**
 * cette fonction nous permet de charger toute les tache crond configurer dans le ficher config
 */
module.exports = {
  initCrons: (config) => {
    Object.keys(config).forEach((key) => {
      if (cron.validate(config[key].frequency)) {
        cron.schedule(config[key].frequency, () => {
          const handler = require(resolve(
            "services",
            "scheduler",
            config[key].handler
          ));
          handler();
        });
      }
    });
  },
};
