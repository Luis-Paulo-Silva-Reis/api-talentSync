const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");
const vagasRouter = require("./routes/vagas");
const emailRoute = require("./routes/emailRoute");




dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());

app.use("/", usersRouter);
app.use("/", vagasRouter);
app.use("/email", emailRoute);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
