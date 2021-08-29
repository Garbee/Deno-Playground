import {client} from '../db/index.ts';
import {Organization as OrganizationType} from '../types/Organization.ts';
import { Client} from 'https://deno.land/x/postgres/mod.ts';

class OrganizationRepo {
    public client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public create(organization: OrganizationType) {
        return this.client.queryObject(
            `INSERT INTO organizations (id, name) VALUES ($1, $2)`,
            organization.id,
            organization.name,
        );
    }

    public createMany(organizations: Array<OrganizationType>) {
        const values = organizations.map((organization) => {
            let {name} = organization;
            return `('${organization.id}', '${organization.name.replace(/'/ig, "''")}')`;
        });
        const query = `INSERT INTO organizations (id, name) VALUES ${values.join(',')};`;
        return this.client.queryObject(
            query
        );
    }
}

export default new OrganizationRepo(client);
