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
dbConnect();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hostelhub01.netlify.app",
      "https://hostel-hub-bl3q.onrender.com",
      "https://hostel-hub-frontend-weld.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

app.listen(port, () => {
  console.log(`Server Started At ${port}`);
});
