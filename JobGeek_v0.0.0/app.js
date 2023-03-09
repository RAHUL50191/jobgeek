const express = require("express");
const jobRouter = require("./router/jobRouter");
const applicationRouter = require("./router/applicationRouter");
const homeRouter = require("./router/homeRouter");
const userRouter = require("./router/userRouter");
const orgRouter = require("./router/orgRouter");
const morgan = require("morgan");

const app = express();

// 1) MIDDLEWARE
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(`public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// 2) ROUTES
app.use("/search-employee", applicationRouter);
app.use("/search-job", jobRouter);
app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/org", orgRouter);
// 2.1) ERRORS
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// 3)TO SERVER
module.exports = app;
