const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

//Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

//View engine
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
//Database connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Connected to database");
    app.listen(PORT);
    console.log(`Listening on http://localhost:${PORT}`);
  })
  .catch((err) => console.log(err));

//Routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/courses", requireAuth, (req, res) => res.render("courses"));
app.use(authRoutes);
