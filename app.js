const path = require("path");

const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const compression = require("compression");

require("dotenv").config({ path: "./config/env.config" });
const database = require("./utils/database");
const handleMulter = require("./middleware/handleMulter");
const { moment, momentTime } = require("./utils/moment");

// Routes
const schoolRoutes = require("./routes/school");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");
const blogRoutes = require("./routes/blog");
const dashboardRoutes = require("./routes/dashboard");
const adminRoutes = require("./routes/admin");
const errorHandler = require("./controller/error");

const app = express();

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
    cookie: { httpOnly: true },
    store: mongoStore.create({ mongoUrl: process.env.MONGODB_URI, ttl: 1 * 24 * 60 * 60 }),
  })
);
app.use(flash());
app.use(handleMulter);
app.use((req, res, next) => {
  const { user } = req.session;
  if (user) req.user = user;
  app.locals.user = req.user;
  app.locals.message = req.flash();
  app.locals.moment = moment;
  app.locals.momentTime = momentTime;
  app.locals.path = req.path;
  next();
});

// ---- Routes Middleware --------
app.use(schoolRoutes);
app.use(authRoutes);
app.use("/me", meRoutes);
app.use("/blog", blogRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/admin", adminRoutes);

// ---- Error handling middleware --------
app.use(errorHandler._404);
app.use(errorHandler._500);

const { PORT, NODE_ENV } = process.env;
database
  .then(() => {
    app.listen(PORT, () => console.log(`Server Runing On Port: ${PORT}, mode: ${NODE_ENV}! (:`));
  })
  .catch(() => console.log("ERROR, in database connection! ):"));
