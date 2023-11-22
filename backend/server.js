const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
app.use(cors());

const userRoute = require("./routes/userRoutes");

app.use(express.json());

mongoose
  .connect(process.env.URI)
  .then(() => {
    app.listen(process.env.PORT || 8000);
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api", userRoute);
