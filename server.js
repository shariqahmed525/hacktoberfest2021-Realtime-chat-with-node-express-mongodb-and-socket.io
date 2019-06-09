const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const Message = mongoose.model("Message", {
  name: String,
  message: String
});

var server = http.listen(port, () => {
  console.log("server is listning on port ", port);
});

var dbUrl =
  "mongodb://<dbusername>:<dbuserpassword>@ds135217.mlab.com:35217/learning-socket-io-with-mongodb";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname));
app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save(err => {
    if (err) {
      sendStatus(500);
    } else {
      io.emit("msg", req.body);
      res.sendStatus(200);
    }
  });
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, () => {
  console.log("mongodb connection successfully!");
});

io.on("connection", () => {
  console.log("user connected with socket.io!");
});
