export interface Alert {
    id: string;
    description: string;
    userId: string;
    read: boolean;
    organizationId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
