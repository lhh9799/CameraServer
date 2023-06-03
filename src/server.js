import express from "express";
var app = express();
var https = require('https');
var fs = require('fs');

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
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

io.sockets.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});