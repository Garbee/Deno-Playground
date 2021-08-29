import {client} from '../db/index.ts';
import {Tag as TagType} from "../types/Tag.ts";
import { Client} from 'https://deno.land/x/postgres/mod.ts';

class TagRepo {
    public client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public create(tag: TagType) {
        return this.client.queryObject(
            `INSERT INTO tags (id, name, owner_id) VALUES ($1, $2, $3)`,
            tag.id,
            tag.name,
            tag.ownerId,
        );
    }

    public createMany(tags: Array<TagType>) {
        const values = tags.map((tag) => {
            return `('${tag.id}', '${tag.name.replace('\'', '\'\'')}', '${tag.ownerId}')`;
        });
        const query = `INSERT INTO tags (id, name, owner_id) VALUES ${values.join(',')};`;
        return this.client.queryObject(
            query
        );
    }
}

export default new TagRepo(client);
