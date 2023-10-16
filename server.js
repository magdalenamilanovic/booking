require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const { IN_PRODUCTION, HALF_DAY, PORT } = require("./config/config");
const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error.message));

app.set("view engine", "ejs");
app.use(fileUpload());
app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: HALF_DAY,
      secure: IN_PRODUCTION,
    },
  })
);

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", require("./routes"));

app.listen(PORT, (error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
