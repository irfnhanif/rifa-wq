export interface Notification {
    id: string;
    userId: string;
    workOrderId: string;
    message: string;
    readStatus: boolean;
    adminReadStatus: boolean;
    createdAt: Date;
    updatedAt: Date;
}
