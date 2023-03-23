const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

const usersRouter = require("./routes/users");
const vagasRouter = require("./routes/vagas");

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());

app.use("/", usersRouter); //essa e a rota base
app.use("/", vagasRouter); //essa e a rota base

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
