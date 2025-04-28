import express from "express";
import controller from "../controller";
import jwt from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebaseAuth";

const router = express.Router();

const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      const userData = jwt.decode(token) as any;
      console.log("userData", userData);

      const isExists = await (
        await getDoc(doc(db, "users", userData.user_id))
      ).exists();

      if (!isExists) {
        res.status(403).send("Account does not exists!!!");
      } else {
        res.locals.uid = userData.user_id;
        next();
      }
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

router.get("/getStockData", authMiddleware, controller.getStockData);
router.get("/getUserAlert", authMiddleware, controller.getUserAlert);
router.get(
  "/getStockDataByTicker",
  authMiddleware,
  controller.getStockDataByTicker
);
router.get("/getAPIUsage", authMiddleware, controller.getAPIUsage);
router.post("/setUserAlert", authMiddleware, controller.setUserAlert);

export default router;
