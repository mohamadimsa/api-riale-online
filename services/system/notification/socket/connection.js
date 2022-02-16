const db = require('$db');
const JWT = require('jsonwebtoken')

let io;
const sendNotification = (success, message, socketID ) => {
        if(socketID){
            io.sockets.to(socketID).emit('notification', {success, message});
        }
}

const socketConnection = (server) => {
    io = require('socket.io')(server, {
        cors:{
            origin: '*',
            methods: 'GET, POST,',
        }
    });
    io.on('connection', (socket) => {
        socket.on('auth', async data => {
            const token = JWT.verify(data.token, process.env.JWT_SECRET);
            if(!token) sendNotification(false, 'Invalid token', data.socketId)

            const checkUser = await db.user.findUnique({
                where: {
                    uuid: token.uuid
                },
            });

            if (!checkUser) return sendNotification(false, 'Invalid user', data.socketId)

            const user = await db.user.update({
                where:{
                    uuid: token.uuid
                },
                data: {
                    socketId: data.socketId
                }
            })

            socket.user = user;

            setTimeout(() => {
                sendNotification(true, `Welcome ${checkUser.name} ${checkUser.forename}!`, user.socketId)
            }, 5000);

            setTimeout(async () => {
                const notifications = await db.notifications.findMany({
                    where: {
                        user_uuid: user.uuid,
                        isRead: false
                    }
                })

                sendNotification(true, `You have ${notifications.length} pending notification(s)`, user.socketId)
            }, 10000)
         
        })

        socket.on('getDevices', async data => {
            const devices = await db.device.findMany()
            io.sockets.emit('devices', devices);
        })
    });
};

module.exports = {
    sendNotification,
    socketConnection
};