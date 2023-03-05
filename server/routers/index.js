const userRouter = require("./user");

const rootRouter = (app) => {
  app.use("/api/user", userRouter);
};

module.exports = rootRouter;