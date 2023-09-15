import { oauthClient } from "../index.ts";
import pool from "./database.config.ts";
async function getAccessTokenAndRealmId() {
  try {
    const client = await pool.connect();
    const query =
      "SELECT accesstoken, realmid FROM quickbook ORDER BY id DESC LIMIT 1"; // Adjust the WHERE condition as needed
    const result = await client.query(query);
    client.release();

    if (result.rows.length > 0) {
      const { accesstoken, realmid } = result.rows[0];
      return { accessToken: accesstoken, realmId: realmid };
    } else {
      throw new Error("No access token and realmId found in the database.");
    }
  } catch (error) {
    console.error("Error fetching access token and realmId:", error);
    throw error;
  }
}

async function getRefreshToken() {
  try {
    const client = await pool.connect();
    const query = "SELECT refreshtoken FROM quickbook ORDER BY id DESC LIMIT 1"; // Adjust the WHERE condition as needed
    const result = await client.query(query);
    client.release();

    if (result.rows.length > 0) {
      const { refreshtoken } = result.rows[0];
      return { refreshtoken: refreshtoken };
    } else {
      throw new Error("No refresh token  found in the database.");
    }
  } catch (error) {
    console.error("Error fetching refresh token :", error);
    throw error;
  }
}

async function updateRefreshToken() {
  try {
    const { refreshtoken } = await getRefreshToken();
    const authResponse = await oauthClient.refreshUsingToken(refreshtoken);

    const access_token = authResponse.getJson().access_token;
    const refresh_token = authResponse.getJson().refresh_token;

    return { access_token, refresh_token };
  } catch (e) {
    console.error("The error message is: " + e);
    console.error(e);
    throw e; // Re-throw the error to be handled by the caller, if needed.
  }
}
export default { getAccessTokenAndRealmId, updateRefreshToken };
