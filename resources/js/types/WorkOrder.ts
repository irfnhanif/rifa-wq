export type Status = 'PENDING' | 'IN_PROCESS' | 'FINISHED' | 'PICKED_UP';

export interface WorkOrder {
    id: string;
    userId: string;
    customerName: string;
    whatsappNumber: string;
    orderTitle: string;
    orderDescription: string | null;
    printingSize: string;
    printingMaterial: string;
    orderDeadline: string | Date;
    orderCost: number | null;
    orderStatus: Status;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
    };
}
