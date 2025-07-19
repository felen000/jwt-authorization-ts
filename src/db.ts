import {Pool, QueryResult, QueryResultRow } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE_NAME,
})

export const query = <T extends QueryResultRow = QueryResultRow>(
    queryString: string,
    params: any[] = []
): Promise<QueryResult<T>> => {
    return pool.query<T>(queryString, params);
} ;