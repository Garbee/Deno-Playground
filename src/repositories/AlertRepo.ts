import {client} from '../db/index.ts';
import {Alert as AlertType} from "../types/Alert.ts";
import { Client} from 'https://deno.land/x/postgres/mod.ts';

class AlertRepo {
    public client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public create(tag: AlertType) {
        return this.client.queryObject(
            `INSERT INTO alerts (id, description, user_id, organization_id, read) VALUES ($1, $2, $3, $4, $5)`,
            tag.id,
            tag.description,
            tag.userId,
            tag.organizationId,
            tag.read,
        );
    }

    public createMany(tags: Array<AlertType>) {
        const values = tags.map((tag) => {
            return `('${tag.id}', '${tag.description}', '${tag.userId}', '${tag.organizationId}', '${tag.read}')`;
        });
        const query = `INSERT INTO alerts (id, description, user_id, organization_id, read) VALUES ${values.join(',')};`;
        return this.client.queryObject(
            query
        );
    }
}

export default new AlertRepo(client);
