import {Alert as AlertType} from '../types/Alert.ts';
import { v4 } from 'https://deno.land/std@0.100.0/uuid/mod.ts';

export class Alert implements AlertType {
    #id!: string;
    description!: string;
    #userId!: string;
    read!: boolean;
    #organizationId!: string;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;

    constructor(data: AlertType) {
        this.id = data.id ?? v4.generate();
        this.description = data.description;
        this.read = data.read ?? false;
        this.userId = data.userId;
        this.organizationId = data.organizationId;
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

    public set userId(id: string) {
        if (v4.validate(id) === false) {
            throw new Error('Invalid UUID v4 provided');
        }

        this.#userId = id;
    }

    public get userId(): string {
        return this.#userId;
    }

    public set organizationId(id: string) {
        if (v4.validate(id) === false) {
            throw new Error('Invalid UUID v4 provided');
        }

        this.#organizationId = id;
    }

    public get organizationId(): string {
        return this.#organizationId;
    }
}