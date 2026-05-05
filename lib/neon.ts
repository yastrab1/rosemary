"use server";
import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function query<T>(
  text: string,
  params: string[],
):
  Promise<T[]> {

  return (await pool.query(text, params)).rows as T[];
}

