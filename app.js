const path = require("path");

const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const compression = require("compression");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "./config/env.config" });
const database = require("./utils/database");
const handleMulter = require("./middleware/handleMulter");
const { moment, momentTime } = require("./utils/moment");

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
const errorHandler = require("./controller/error.controller");

const app = express();
const csrfProtection = csrf({ cookie: true });

// Configuration view engin.
app.set("view engine", "ejs");
app.set("views", "views");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public", "dist")));
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "FuckYouHacker",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, sameSite: true },
    store: mongoStore.create({ mongoUrl: process.env.MONGODB_URI, ttl: 1 * 24 * 60 * 60 }),
  })
);
app.use(flash());
app.use(cookieParser());
app.use(handleMulter);
app.use(csrfProtection);
app.use((req, res, next) => {
  const { user } = req.session;
  if (user) req.user = user;
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
app.use(errorHandler._404);
app.use(errorHandler._500);

const { PORT, NODE_ENV } = process.env;
database
  .then(() => {
    app.listen(PORT, () => console.log(`Server Runing On Port: ${PORT}, mode: ${NODE_ENV}! (:`));
  })
  .catch(() => console.log("Database connection failed! ):"));