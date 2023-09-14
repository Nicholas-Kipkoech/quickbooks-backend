// @ts-ignore
import OAuthClient from "intuit-oauth";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import customerRouter from "./routes/Customer.ts";
import accountRouter from "./routes/Accounts.ts";
import billRouter from "./routes/Bills.ts";
import employeeRouter from "./routes/Employees.ts";
import cors from "cors";
import { Pool } from "pg";

const server = express();

config();
server.use(cors());

//connect to postgress

const pool = new Pool({
  user: "nick",
  host: "postgres", // Replace with your Docker container's hostname or IP
  database: "quickbooks",
  password: "pass",
  port: 5432,
});
//function for inserting data to db
async function insertData(
  realmId: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const client = await pool.connect();

    const sql =
      "INSERT INTO auth_tokens (realmId, accessToken, refreshToken) VALUES ($1, $2, $3)";
    const values = [realmId, accessToken, refreshToken];

    await client.query(sql, values);
    console.log("Data inserted successfully.");
    client.release();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

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
      const realmId = authResponse.getJson().realmId;
      const accessToken = authResponse.getToken().access_token;
      const refreshToken = authResponse.getToken().refresh_token;
      await insertData(realmId, accessToken, refreshToken);
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      res.send(oauth2_token_json);
    })
    .catch(function (e: Error) {
      return res.status(500).json(e);
    });
});
//for quering refreshtoken
server.get("/refreshAccessToken", (req, res) => {
  oauthClient
    .refresh()
    .then(function (authResponse: any) {
      console.log(
        "The Refresh Token is  " + JSON.stringify(authResponse.getJson())
      );
      oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      res.send(oauth2_token_json);
    })
    .catch(function (e: Error) {
      res.send(e);
    });
});

//endpoints with customer router imports
server.use("/customers", customerRouter);
server.use("/accounts", accountRouter);
server.use("/bills", billRouter);
server.use("/employees", employeeRouter);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => console.log(`server started on port ${PORT}`));
