import pool from "../config/database.config.ts";
async function insertAuthtokens(
  realmId: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const client = await pool.connect();
    const sql =
      "INSERT INTO auth_tokens (realmid, accesstoken, refreshtoken) VALUES ($1, $2, $3)";
    const values = [realmId, accessToken, refreshToken];
    await client.query(sql, values);
    console.log("Data inserted successfully.");
    client.release();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

export default insertAuthtokens;
