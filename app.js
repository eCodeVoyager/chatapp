var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const connectDB = require("./db/database");

const bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const server = require("http").createServer(app);
// Connect to MongoDB
connectDB();

// Socket.io
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("avatarUpdated", (avatar) => {
    io.emit("avatarUpdated", avatar);
  });
});

io.on("connection", (socket) => {
  console.log("New WS Connection...");

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", "Welcome to the chat!");
    socket.broadcast
      .to(room)
      .emit("message", `${username} has joined the chat`);

    socket.on("chatMessage", (msg) => {
      io.to(room).emit("message", msg);
    });
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
