const { Expo } = require("expo-server-sdk");
// Créer un nouveau client Expo SDK
// en option, fournir un jeton d'accès si vous avez activé la sécurité push
let expo = new Expo(/**{ accessToken: process.env.EXPO_ACCESS_TOKEN}**/);
const db = require("$db");

/**
 *cette fonction nous permet d'envoyer des pushNotification grouper ayant un message identique
 * @param {Objet} message ce message qu'on souhaite envoyer
 * {body ,title ,data,badge}
 * @param {String}  user_uuid
 */

module.exports = pushNotification = async (message, user_uuid) => {
  const user = await db.tokenPushNotification.findMany({
    where: {
      user_uuid: user_uuid,
    },
  });
  console.log({ message });
  console.log(user_uuid);

  let pushToken = [];
  user.map((e) => {
    pushToken.push(e.token);
  });
  console.log(user);
  //   // Crée les messages que tu veux envoyer aux clients
  let messages = [];
  for (let somePushTokens of pushToken) {
    // Chaque jeton push ressemble à ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Vérifiez que tous vos jetons push semblent être des jetons push Expo valides
    if (!Expo.isExpoPushToken(somePushTokens)) {
      console.error(`le token  ${somePushTokens} n'est pas valide`);
      continue;
    }

    // Construit un message (voir https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: somePushTokens,
      sound: "default",
      body: message.body,
      data: message.data,
      title: message.title,
      badge: message.badge,
    });
  }
  // Le service de notification push Expo accepte des lots de notifications, donc
  // que vous n'avez pas besoin d'envoyer 1000 requêtes pour envoyer 1000 notifications. Nous
  // vous recommandez de traiter vos notifications par lots pour réduire le nombre de demandes
  // et de les compresser (les notifications avec un contenu similaire obtiendront
  // compressé).

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Envoie les morceaux au service de notification push Expo. Il y a
    // différentes stratégies que vous pourriez utiliser. Un simple est d'envoyer un morceau à un
    // temps, ce qui répartit bien la charge dans le temps :
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // REMARQUE : si un ticket contient un code d'erreur dans ticket.details.error, vous
        // doit le gérer de manière appropriée. Les codes d'erreur sont listés dans l'Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  // Plus tard, après que le service de notification push Expo a livré le
  // notifications à Apple ou Google (généralement rapidement, mais autorisez le service
  // jusqu'à 30 minutes en cas de chargement), un "reçu" pour chaque notification est
  // créé. Les reçus seront disponibles pendant au moins une journée ; des reçus périmés
  // sont supprimés.
  //
  // L'ID de chaque reçu est renvoyé dans la réponse "ticket" pour chaque
  // notification. En résumé, l'envoi d'une notification produit un ticket qui
  // contient un identifiant de reçu que vous utiliserez ultérieurement pour obtenir le reçu.
  //
  // Les reçus peuvent contenir des codes d'erreur auxquels vous devez répondre. En
  // en particulier, Apple ou Google peuvent bloquer les applications qui continuent à envoyer
  // notifications aux appareils qui ont bloqué des notifications ou qui ont été désinstallés
  // votre application. Expo ne contrôle pas cette politique et renvoie les commentaires de
  // Apple et Google pour que vous puissiez le gérer de manière appropriée.
  let receiptIds = [];
  for (let ticket of tickets) {
    // REMARQUE : tous les tickets n'ont pas d'ID ; par exemple, les tickets pour les notifications
    // qui n'a pas pu être mis en file d'attente aura des informations d'erreur et aucun identifiant de reçu.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  async () => {
    // Comme l'envoi de notifications, il existe différentes stratégies que vous pouvez utiliser
    // pour récupérer des lots de reçus du service Expo.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // Les reçus précisent si Apple ou Google ont reçu avec succès le
        // notification et informations sur une erreur, si elle s'est produite.
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === "ok") {
            continue;
          } else if (status === "error") {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              // Les codes d'erreur sont listés dans la documentation de l'Expo :
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // Vous devez gérer les erreurs de manière appropriée.
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
};
