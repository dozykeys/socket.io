let express = require("express");
let app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.post("/chat", (req, res) => {
  if (!req.body.name) {
    res.redirect("/");
    return;
  }

  io.on("connection", (socket) => {
    socket.on("new", (e) => {
      socket.broadcast.emit("new", e);
    });
    socket.on("disconnect", () => {
      socket.broadcast.emit("disconnected", `${req.body.name} disconnected`);
    });
  });

  io.emit("joined", { user: req.body.name });

  res.render("chat", { name: req.body.name });
});
let port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log("listening on port " + port);
});
