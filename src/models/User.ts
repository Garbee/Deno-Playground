import {User as UserType} from '../types/User.ts';
import { v4 } from 'https://deno.land/std@0.100.0/uuid/mod.ts';

export class User implements UserType{
    #id!: string;
    #email!: string;
    firstName: string;
    lastName: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: UserType) {
        this.id = data.id ?? v4.generate();
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
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

    public set email(email: string) {
        this.#email = email;
    }

    public get email() {
        return this.#email;
    }
}
