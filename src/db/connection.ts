import { Client } from "pg"
import { IDB_CONFIG } from "../types.d"

let client: Client;

async function init(DB_CONFIG: IDB_CONFIG) {
    try {
        client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB,
            password: process.env.DB_PASS,
            port: Number(process.env.DB_PORT),
        });

        await client.connect()
        console.debug('Postgres Connection generated successfully');
    } catch (error) {
        console.error('[postgres.connector][init][Error]: ', error);
        throw new Error('failed to initialized connection');
    }
};


/**
 * executes SQL queries in Postgres db 
 * 
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query 
 */
async function execute(query: string, params: string[]) {
    try {
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('[postgres.connector][execute][Error]: ', error);
        console.debug('failed to execute query', query, params);
        throw new Error('failed to execute query');
    }
}


export {
    init,
    execute
}
