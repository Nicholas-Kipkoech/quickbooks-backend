import pool from "../config/database.config.ts";
async function insertAuthtokens(
  realmId: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const client = await pool.connect();
    const sql =
      "INSERT INTO quickbook (realmid, accesstoken, refreshtoken) VALUES ($1, $2, $3)";
    const values = [realmId, accessToken, refreshToken];
    await client.query(sql, values);
    console.log("Data inserted successfully.");
    client.release();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

async function updateAuthToken(
  realmId: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const client = await pool.connect();
    const sql =
      "UPDATE quickbook SET accesstoken = $2, refreshtoken = $3 WHERE realmid = $1";
    const values = [realmId, accessToken, refreshToken];
    await client.query(sql, values);
    console.log("Data updated successfully.");
    client.release();
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

export default { insertAuthtokens, updateAuthToken };
