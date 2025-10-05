import cron from "node-cron";
import { BlackListedToken } from "../DB/Models/index.js";
// every day at midnight
export const BlackListedTokens = cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  const result = await BlackListedToken.deleteMany({ expirationDate: { $lt: now } });
  console.log("Expired Black-Listed-Tokens deleted", result.deletedCount);
});
