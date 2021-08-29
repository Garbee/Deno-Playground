import {Organization as OrganizationType} from '../types/Organization.ts';
import { v4 } from 'https://deno.land/std@0.100.0/uuid/mod.ts';

export class Organization implements OrganizationType {
    #id!: string;
    name!: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: OrganizationType) {
        this.id = data.id ?? v4.generate();
        this.name = data.name;
        this.createdAt = data.createdAt ?? new Date();
        this.updatedAt = data.updatedAt ?? new Date();
    }

    public set id(id: string) {
        if (v4.validate(id) === false) {
            throw new Error('Invalid UUID v4 provided');
        }

        this.#id = id;
    }

    public get id(): string {
        return this.#id;
    }
}
