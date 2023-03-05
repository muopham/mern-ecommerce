const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/configDB")
const rootRouter = require("./routers")

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// connect DB
dbConnect();

// config router
rootRouter(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}` );
});
