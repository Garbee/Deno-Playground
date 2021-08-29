import {client} from '../db/index.ts';
import {User as UserType} from "../types/User.ts";
import {User} from "../models/User.ts";
import { Client} from 'https://deno.land/x/postgres/mod.ts';
import { QueryObjectResult } from 'https://deno.land/x/postgres@v0.12.0/query/query.ts';

class UserRepo {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public create(user: UserType) {
        return this.client.queryObject(
            `INSERT INTO users (id, email, first_name, last_name) VALUES ($1, $2, $3, $4)`,
            user.id,
            user.email,
            user.firstName,
            user.lastName,
        );
    }

    public createMany(users: Array<UserType>) {
        const values = users.map((user) => {
            return `('${user.id}', '${user.email}', '${user.firstName.replace(/'/i, '\'\'')}', '${user.lastName.replace(/'/i, '\'\'')}')`;
        });
        const query = `INSERT INTO users (id, email, first_name, last_name) VALUES ${values.join(',')};`;
        return this.client.queryObject(
            query
        );
    }

    public async selectAll(): Promise<Array<User>> {
        const results = await this.client.queryObject("SELECT id,email,first_name,last_name,created_at,updated_at FROM users ORDER BY created_at");
        return results.rows.map((item: any) => {
            item.updatedAt = item.updated_at;
            item.createdAt = item.created_at;
            item.firstName = item.first_name;
            item.lastName = item.last_name;
            return new User(item as UserType);
        });
    }

    public selectById(id: string): Promise<QueryObjectResult<UserType>> {
        return this.client.queryObject(`SELECT * FROM users WHERE id = $1`, id);
    }

    public delete(id: string) {
        return this.client.queryObject(`DELETE FROM users WHERE id = $1`, id);
    }

    // public async update(id: string, user: Partial<User>) {
    //     const latestUser = await this.selectById(id);
    //     const query = `UPDATE users SET email = $1 WHERE id = $4`;
    //
    //     return await this.client.queryObject(
    //         query,
    //         user.email ?? latestUser.email,
    //         id
    //     );
    // }
}

export default new UserRepo(client);
