import http from "http";
import SocketIo from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const ioServer = SocketIo(httpServer);

ioServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, joinAfter) => {
    socket.join("roomName");
    joinAfter();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
  socket.on("message", (msg, roomName, sendAfter) => {
    socket.to(roomName).emit("message", msg);
    sendAfter();
  });
});

// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anonymous";
//   console.log("Connected to Browser!");
//   socket.on("close", () => console.log("Disconnected from the Browser.."));
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);

//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((eachSocket) =>
//           eachSocket.send(`${socket.nickname} : ${message.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload;
//         break;
//     }
//     // message = isBinary ? message : message.toS tring();
//   });
// });

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
