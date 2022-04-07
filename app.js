const express = require("express");
const app = express();

const http = require("http");

const server = http.createServer(app);
(async () => {
  const cors = require("cors");
  const morgan = require("morgan");

  // metric informations for server
  const actuator = require("express-actuator");

  const actuatorOptions = {
    basePath: "/kraaken", // It will set /management/info instead of /info
    infoGitMode: "full", // the amount of git information you want to expose, 'simple' or 'full',
    infoBuildOptions: null, // extra information you want to expose in the build object. Requires an object.
    infoDateFormat: null, // by default, git.commit.time will show as is defined in git.properties. If infoDateFormat is defined, moment will format git.commit.time. See https://momentjs.com/docs/#/displaying/format/.
    customEndpoints: [], // array of custom endpoints
  };

  app.use(actuator(actuatorOptions));
  app.use(express.static("public"));
  // helmet security
  const helmet = require("helmet");

  app.use(helmet());
  const fileUpload = require("express-fileupload");
  app.use(
    fileUpload({
      createParentPath: true,
      preserveExtension: true,
      safeFileNames: true,
    })
  );

  //cors
  app.use(
    cors({
      origin: "*",
      credentials: false,
    })
  );

  try {
    // discovering controllers
    require("$controllers/index");
  } catch (e) {
    console.log(e.toString());
  }

  // cookie / session
  const cookieParser = require("cookie-parser");
  const bodyParser = require("body-parser");
  const session = require("express-session");
  const oneDay = 1000 * 60 * 60 * 24;
  const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false, maxAge: oneDay },
    resave: false,
    saveUninitialized: true,
  };

  if (process.env.APP_ENV === "production") {
    Object.defineProperty(app.request, "ip", {
      configurable: true,
      enumerable: true,
      get: function () {
        return this.get("cf-connecting-ip") || this.get("x-real-ip");
      },
    });
  }

  // headers
  app.use(function (req, res, next) {
    res.setHeader("X-Powered-By", "riale-online");
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS,PUT,DELETE,PATCH"
    );
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  // parse x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(session(sess));

  // parse application/json
  app.use(bodyParser.json());

  app.use(cookieParser());

  app.use(morgan("tiny"));


  app.get("/", (req, res) => res.send("Welcome to honey-pot API !!"));

  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  require("./routes/")(app);

  server.listen(7001, () => {
    console.log("[SERVER] start server on port 7001");
  });

  // notification server
  const {
    socketConnection,
  } = require("$services/system/notification/socket/connection");
  try {
    socketConnection(server);
  } catch (e) {
    console.log(e.toString());
  }
})();

module.exports = app;
