import { Pool } from "pg";

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "pass",
  port: 5432,
};

const pool = new Pool(dbConfig);

export default pool;
