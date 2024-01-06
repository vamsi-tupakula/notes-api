const express = require("express");
require("dotenv").config();
const { dbConnect } = require("./db/dbConnect");
const notes_routes = require("./routes/notes.route");
const user_routes = require("./routes/user.route");
const PORT = process.env.PORT || 5000;

dbConnect();
const app = express();

app.use(require("cors")({ origin: "*" }));
app.use(express.json());
app.use("/api/auth", user_routes);
app.use("/api/notes", notes_routes);

app.listen(PORT, () => {
  console.log(`server running port ${PORT}`);
});
