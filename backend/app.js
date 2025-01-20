import express from "express";
import configExpress from "./config/express.js";
import router from "./Router/router.js";

const app = express();

configExpress(app);

app.use("/api", router);

export default app;
