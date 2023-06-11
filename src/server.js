import express from "express";
var app = express();
var https = require('https');
var fs = require('fs');

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/admin", (_, res) => res.render("adminPage"));
app.get("/*", (_, res) => res.redirect("/"));

require("dotenv").config();

const options = {
  key: fs.readFileSync(process.env.const_options_keyPath),    //Enter your own key path
  cert: fs.readFileSync(process.env.const_options_certPath),  //Enter your own cert path

  passphrase: process.env.passphrase                          //Enter your password which you typed when installing SSL certificate
};

var server = https.createServer(options, app);
var io = require('socket.io')(server);

const PORT = 443;
server.listen(PORT, () => {
  console.log(`HTTPS Server started on port ${PORT}`);
});

// let peerCount = 0;
// let streamIndex = 0;
// let streamInUse = Array(4).fill(false);

io.sockets.on("connection", (socket) => {
  // if(peerCount == 4)
  //   return;

  socket.on("join_room", (roomName) => {
    console.log("socket.rooms 1: ", socket.rooms);

    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    console.log("socket.rooms 3: ", socket.rooms);

    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    console.log("socket.rooms 4: ", socket.rooms);

    socket.to(roomName).emit("ice", ice);
  });
  // socket.on("connected", () => {
  //   ++peerCount;
  // });
  // socket.on("disconnected", () => {
  //   --peerCount;
  // });
});