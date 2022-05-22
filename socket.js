let io;
const service = {};

const socketConnection = (ioServer) => {
  io = ioServer;

  io.on("connection", (socket) => {
    //socket permettant de mettre un user dans la rooms lorsque il est connecter
    console.log("connection socket ");
    socket.on("authSocket", (e) => {
      console.log(e);
      if (e.user && e.forename) {
        console.log("connection de l'utilisateur : " + e.forename);
        io.to(e.uuid);
      }
    });
    socket.on("error", (err) => {
      console.log("ERROR SERVER : ", err);
      if (err && err.message === "unauthorized event") {
        socket.disconnect();
      }
    });
  });
};

module.exports = {
  socketConnection,
  service,
  io,
};
