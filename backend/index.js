const express = require("express");
require("dotenv").config();
const dbConnect = require("./dbConnection");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { checkForAuthentication } = require("./middlewares/auth.middlewares.js");
const userRouter = require("./routes/user.routes.js");
const gatepassRouter = require("./routes/gatepass.routes.js");
const complaintsRouter = require("./routes/complaints.routes.js");
const adminRouter = require("./routes/admin.routes.js");

const app = express();
const port = process.env.PORT;
const allowedOrigins = ["http://localhost:3000"];

if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.push(
    ...process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  );
}

dbConnect();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(checkForAuthentication);
app.use(express.static(path.resolve("./public")));

app.use("/user", userRouter);
app.use("/gatepass", gatepassRouter);
app.use("/complaints", complaintsRouter);
app.use("/admin", adminRouter);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server Started At ${port}`);
  });
}

module.exports = app;
