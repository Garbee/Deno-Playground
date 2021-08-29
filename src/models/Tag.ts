import {Tag as TagType} from '../types/Tag.ts';
import { v4 } from 'https://deno.land/std@0.100.0/uuid/mod.ts';

export class Tag implements TagType {
    #id!: string;
    name!: string;
    #ownerId!: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: TagType) {
        this.id = data.id ?? v4.generate();
        this.name = data.name;
        this.ownerId = data.ownerId;
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

    public set ownerId(id: string) {
        if (v4.validate(id) === false) {
            throw new Error('Invalid UUID v4 provided');
        }

        this.#ownerId = id;
    }

    public get ownerId(): string {
        return this.#ownerId;
    }
}
