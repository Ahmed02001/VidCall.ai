import express from "express";

import { ENV } from "./lib/env.js";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "sccess to API" });
});

app.listen(ENV.PORT, () => {
  console.log(`Server Running on Port ${ENV.PORT}`);
});
