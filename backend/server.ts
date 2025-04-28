import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import controller from "./controller";

import cron from "node-cron";

dotenv.config();
const app = express();
const port = process.env.PORT || 3300;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/", async (req: express.Request, res: express.Response) => {
  res.json({ message: "Welcome!" });
});

cron.schedule("*/15 * * * *", function () {
  console.log("mail checkeds==============> checked");
  controller.alertUsers();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
