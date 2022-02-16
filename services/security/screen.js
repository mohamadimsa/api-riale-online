const db = require("$db");
const service_email = require("$services/Mail/index");

const screen = async (req, res, user, token) => {

    /**
     * @description récupère les connexion de l'utilisateur
     */
    const connected = await db.connected.findUnique({
        where: {
            user_uuid: user.uuid
        },
        include: {
            ipAddress: true
        }
    })

    /**
     * @description Si il n'y a pas de connexion on vas créé la première connexion
     */
    if(!connected){
        const connected = await db.connected.create({
            data: {
                user: {
                    connect: {
                        uuid: user.uuid
                    }
                },
            }
        })

        const ipAddress = await db.ipAddress.create({
            data: {
                isConnected: true,
                token: token,
                ipAddress: req.ip,
                connected_uuid: connected.uuid
            }
        })

        if(!ipAddress){
            return res.status(500).json({
                error: '',
                message: "Server Error"
            })
        }


        /**
         * @description Si l'ip de la requêtes est différente des ip connus en BDD on vas appliquer plusieurs vérifications
         */
    } else if(req.ip && !connected.ipAddress.includes(req.ip)) {

        /**
         * @description recherche l'ip
         */
        const screen = await db.ipAddress.findUnique({
            where: {
                ipAddress: req.ip
            }
        })

        if(! screen){
            const data =  await db.ipAddress.findMany({where: {connected_uuid: connected.uuid, isConnected: true}});
            const isAllConnected = []

            for(let i in data){
                isAllConnected.push(data[i].isConnected);
            }

            /**
             * @description vérifie si tous les utilisateurs max autorisé sont déjà connecté
             */
            if(data.length >= user.multiPlatformNumber && isAllConnected.every((val, i, arr) => val === arr[0])){
                /**
                 * @description si oui on envoie un mail qui dit comme quoi la limite a été atteinte.
                 */
                await service_email.sendMail("ConnexionReached", "fr", [
                    {
                        ip: req.ip,
                        date: new Date(),
                        email: user.email,
                        subject: 'Limite de connexion atteinte',
                        limit: user.multiPlatformNumber,
                    },
                ]);

                /**
                 * @description retourne l'erreur comme quoi la limite a été atteinte
                 */
                return res.status(401).json({
                    error: "",
                    message: "You have reach limited connexion, disconnect from one."
                })
            }

            /**
             * @description si les limite non pas été atteinte mais que l'utilisateur n'est pas en BDD on vas créé un champs afin de le considérer comme connecté
             */
            req.session.screen = await db.ipAddress.create({
                data: {
                    isConnected: true,
                    token: token,
                    ipAddress: req.ip,
                    connected_uuid: connected.uuid
                }
            })
            /**
             * @description envoie du mail comme quoi une connexion différente des connexion enregistré est detecte.
             */
            await service_email.sendMail("ConnexionDifferent", "fr", [
                {
                    ip: req.ip,
                    subject: 'Une connexion différente à été détecté',
                    email: user.email,
                    date: new Date()
                },
            ]);
        } else if (screen.isConnected && req.ip === screen.ipAddress){
            await db.ipAddress.update({
                where: {
                    uuid: screen.uuid
                },
                data: {
                    isConnected: true,
                    token: token
                }
            })

            return res.status(200).json({token: token})
        } else if (screen.isConnected){
            /**
             * @description vérifie si l'user n'est pas déjà connecté.
             */
            return res.status(401).json({
                error: "",
                message: "You are already connected"
            })
        }

        if(screen){
            req.session.screen = screen
        }
        /**
         * @description définit l'user comme connecter.
         */
        await db.ipAddress.update({
            where: {
                uuid: req.session.screen.uuid
            },
            data: {
                isConnected: true,
                token: token
            }
        })
    }
    return res.status(200).json({token: token})
}

module.exports = screen