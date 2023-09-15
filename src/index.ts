// @ts-ignore
import OAuthClient from "intuit-oauth";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import customerRouter from "./routes/Customer.ts";
import accountRouter from "./routes/Accounts.ts";
import billRouter from "./routes/Bills.ts";
import employeeRouter from "./routes/Employees.ts";
import cors from "cors";
import authToken from "./config/authToken.ts";
import qbDb from "./helpers/data.controller.ts";
import cron from "node-cron";
const server = express();

config();
server.use(cors());

//connect to postgress

//function for inserting data to db

// @ts-ignore
export const oauthClient = new OAuthClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  environment: "sandbox",
  redirectUri: "http://localhost:3002/callback",
});

let oauth2_token_json = null;

server.get("/auth", (req: Request, res: Response) => {
  const authUri = oauthClient.authorizeUri({
    // @ts-ignore
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
    state: "intuit-test-state", // Replace with your custom state value
  });
  res.redirect(authUri);
});

//callback for getting authresponses
server.get("/callback", (req, res) => {
  oauthClient
    .createToken(req.url)
    .then(async function (authResponse: any) {
      const realmId = oauthClient.getToken().realmId;
      const accessToken = authResponse.getToken().access_token;
      const refreshToken = authResponse.getToken().refresh_token;
      await qbDb.insertAuthtokens(realmId, accessToken, refreshToken);

      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      res.send({ success: "App connected successfully" });
    })
    .catch(function (e: Error) {
      return res.status(500).json(e);
    });
});

//update auth tokens in db
const task = cron.schedule("*/50 * * * *", async () => {
  try {
    const { realmId } = await authToken.getAccessTokenAndRealmId();
    const { refresh_token, access_token } =
      await authToken.updateRefreshToken();
    await qbDb.updateAuthToken(realmId, access_token, refresh_token);
    console.log("Data updated successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
});

// Log that the job has started
console.log("Cron job started.");

// Start the cron job
task.start();
//endpoints with customer router imports
server.use("/customers", customerRouter);
server.use("/accounts", accountRouter);
server.use("/bills", billRouter);
server.use("/employees", employeeRouter);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => console.log(`server started on port ${PORT}`));
