/**
 * liste des tache cron programmer
 * frequency : la frequence de la tache
 * handler : fonction a executer
 */
module.exports = {
  hello: {
    frequency: "*/1 * * * * *",
    handler: "handlers/hello",
  },
};
