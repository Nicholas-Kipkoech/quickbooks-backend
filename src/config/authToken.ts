import pool from "./database.config.ts";
async function getAccessTokenAndRealmId() {
  try {
    const client = await pool.connect();
    const query =
      "SELECT accesstoken, realmid FROM auth_tokens ORDER BY id DESC LIMIT 1"; // Adjust the WHERE condition as needed
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

export default getAccessTokenAndRealmId;
