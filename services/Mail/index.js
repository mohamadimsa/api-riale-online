const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const Sentry = require('$sentry')
//config transpoter
const mg = mailgun({
  auth: {
    api_key: process.env.MAILGUN || '105315829989efd7afcc8454bad88198-7dcc6512-a64be4e0',
    domain: process.env.MAILGUN_DOMAIN || 'kraaken.fr',
  },
  host: process.env.MAILGUN_HOST || 'api.eu.mailgun.net'
})
const transporter = nodemailer.createTransport(mg);

const EmailTemplate = require("email-templates").EmailTemplate,
  path = require("path"),
  Promise = require("bluebird");

function sendEmail(obj) {
  return transporter.sendMail(obj);
}
/**
 *
 * @param {*} templateName
 * @param {*} contexts
 * @param {*} lang
 * loadTemplate
 */
const loadTemplate = (templateName, contexts, lang) => {
  let template = new EmailTemplate(
    path.join(__dirname, "templates", templateName + "/" + lang)
  );
  return Promise.all(
    contexts.map((context) => {
      return new Promise((resolve, reject) => {
        template.render(context, (err, result) => {
          if (err) reject(err);
          else
            resolve({
              email: result,
              context,
            });
        });
      });
    })
  );
};

module.exports = {
  /**
   *
   * @param {String} templateName name template
   * @param {String} langage langage preference user
   * @param {array} users info end option mail user
   * email one or more users
   */
  sendMail: (templateName, langage, users) => {
    loadTemplate(templateName, users, langage)
      .then((results) => {
        return Promise.all(
          results.map((result) => {
            sendEmail({
              to: result.context.email,
              html: result.email.html,
              from: "noreply@Bank-online.fr",
              subject: result.context.subject,
              cc: result.context.cc,
            });
          })
        );
      })
      .catch((err) => {
        Sentry.captureException(err);
        console.log(err);
      });
  },
};
