import { Client } from "https://deno.land/x/postgres/mod.ts";
import {dotEnvConfig} from "../deps.ts";

dotEnvConfig({export: true});

class Database {
    public client: Client;

    constructor() {
        this.client = new Client({
            user: Deno.env.get('POSTGRES_USER'),
            database: Deno.env.get('POSTGRES_DB'),
            hostname: 'localhost',
            password: Deno.env.get('POSTGRES_PASSWORD'),
            port: parseInt(Deno.env.get('POSTGRES_PORT') as string, 10),
        });
    }

    async connect() {
        await this.client.connect();
    }
}

const db = new Database();

await db.connect();

export const client = db.client;
