const path = require("path");

const express = require("express");
const mongoStore = require("connect-mongo");
const session = require("express-session");
const csrf = require("csurf");
const compression = require("compression");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const dotenv = require("dotenv");

dotenv.config({ path: "./config/.env" });

const connectDb = require("./config/database");
const handleMulter = require("./middleware/handleMulter");
const { moment, momentTime } = require("./utils/moment");
const { defineAbilityFor } = require("./security/abilities");

// Routes
const schoolRoutes = require("./routes/school.route");
const authRoutes = require("./routes/auth.route");
const meRoutes = require("./routes/me.route");
const blogRoutes = require("./routes/blog.route");
const commentRoutes = require("./routes/comment.route");
const eventRoutes = require("./routes/event.route");
const galleryRoutes = require("./routes/gallery.route");
const dashboardRoutes = require("./routes/dashboard.route");
const userRoutes = require("./routes/user.route");
const { errorHandler, pageNotFound } = require("./middleware/errorHandler");
const logErrors = require("./middleware/logError");

function createApp() {
  const app = express();
  connectDb();

  const csrfProtection = csrf({ cookie: true });

  // View engin configuration.
  app.set("view engine", "ejs");
  app.set("views", "views");

  // Middlewares
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  // app.use(helmet());
  app.use(compression());
  // Cookie & Session configuation
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: "Nothing",
      resave: false,
      saveUninitialized: true,
      cookie: { httpOnly: true, sameSite: true },
      store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 1 * 24 * 60 * 60,
      }),
    }),
  );
  app.use(flash());
  app.use(cookieParser());
  app.use(handleMulter);
  app.use(csrfProtection);
  app.use((req, res, next) => {
    const { user } = req.session;
    if (user) req.user = user;
    req.ability = defineAbilityFor(user);
    app.locals.user = req.user;
    app.locals.message = req.flash();
    app.locals.moment = moment;
    app.locals.momentTime = momentTime;
    app.locals.path = req.path;
    app.locals.csrfToken = req.csrfToken();
    next();
  });

  // ---- Routes Middleware --------
  app.use(schoolRoutes);
  app.use(authRoutes);
  app.use("/me", meRoutes);
  app.use("/user", userRoutes);
  app.use("/blog", blogRoutes);
  app.use("/comment", commentRoutes);
  app.use("/event", eventRoutes);
  app.use("/gallery", galleryRoutes);
  app.use("/dashboard", dashboardRoutes);

  // ---- Error handling middleware --------
  app.use(logErrors);
  app.use(errorHandler);
  app.use(pageNotFound);

  return app;
}

module.exports = createApp;
