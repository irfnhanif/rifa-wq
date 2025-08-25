export type Status = 'PENDING' | 'PROCESSED' | 'FINISHED' | 'PICKED_UP';

export interface WorkOrder {
    id: string;
    userId: string;
    customerName: string;
    whatsappNumber: string;
    orderTitle: string;
    orderDescription: string;
    printingSize: string;
    printingMaterial: string;
    orderDeadline: string;
    orderStatus: Status;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        username: string;
    };
}
