// resources/js/Components/WorkOrderCard.tsx
import React from 'react';
import clsx from 'clsx';
import { Badge, Button } from 'flowbite-react';
import { CalendarDays, Check, Clock, Hourglass, LucideIcon, SquarePen, Truck } from 'lucide-react';
import { WorkOrder, Status } from '@/types/WorkOrder';

interface WorkOrderCardProps {
    order: WorkOrder;
}

const statusStyles: Record<Status, { iconColor: string; Icon: LucideIcon }> = {
    PENDING: { iconColor: 'text-[#B91C1C]', Icon: Clock },
    PROCESSED: { iconColor: 'text-[#D97706]', Icon: Hourglass },
    FINISHED: { iconColor: 'text-[#047857]', Icon: Check },
    PICKED_UP: { iconColor: 'text-[#1447E6]', Icon: Truck },
};

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ order }) => {
    const { customerName, orderTitle, orderDeadline, orderStatus } = order;
    const styles = statusStyles[orderStatus as Status] ?? statusStyles.PENDING;

    return (
        <div className={clsx('flex w-full items-center gap-6 overflow-hidden rounded-xl border border-[#E5E7EB] p-7 shadow-sm')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <styles.Icon className={clsx('h-6 w-6', styles.iconColor)} />
            </div>

            <div className="flex-1">
                <h3 className="text-2xl font-semibold text-[#101828]">{customerName}</h3>
                <p className="text-base text-[#4A5565]">{orderTitle}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
                <span className="text-base text-[#4A5565]">Deadline</span>
                <Badge color="gray" icon={CalendarDays} size="sm">
                    {orderDeadline}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                <Button className="bg-[#E5E7EB] text-[#101828] hover:bg-gray-200 focus:ring-gray-300">
                    <SquarePen className="mr-2 h-4 w-4" />
                    Edit
                </Button>
                <Button className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                    <Check className="mr-2 h-4 w-4" />
                    Tandai Selesai
                </Button>
            </div>
        </div>
    );
};

export default WorkOrderCard;
