// resources/js/Components/WorkOrderCard.tsx
import { Status, WorkOrder } from '@/types/WorkOrder';
import clsx from 'clsx';
import { Badge, Button } from 'flowbite-react';
import { CalendarDays, Check, Clock, Hourglass, LucideIcon, SquarePen, Truck } from 'lucide-react';
import React from 'react';

interface WorkOrderCardProps {
    order: WorkOrder;
    onEdit: (workOrder: WorkOrder) => void;
    onClick: (workOrder: WorkOrder) => void;
}

const statusStyles: Record<Status, { iconColor: string; Icon: LucideIcon }> = {
    PENDING: { iconColor: 'text-[#B91C1C]', Icon: Clock },
    IN_PROCESS: { iconColor: 'text-[#D97706]', Icon: Hourglass },
    FINISHED: { iconColor: 'text-[#047857]', Icon: Check },
    PICKED_UP: { iconColor: 'text-[#1447E6]', Icon: Truck },
};

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ order: workOrder, onEdit, onClick }) => {
    const { id, customerName, orderTitle, orderDeadline, orderStatus } = workOrder;
    const styles = statusStyles[orderStatus as Status] ?? statusStyles.PENDING;

    const handleMarkComplete = (id: string, status: Status) => () => {};

    const formattedOrderDeadline = new Date(orderDeadline).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const renderActionButton = (id: string, orderStatus: Status) => {
        const handleButtonClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            handleMarkComplete(id, orderStatus)();
        };

        if (orderStatus === 'PENDING') {
            return (
                <Button className="bg-[#D97706] text-[#FFFFFF] hover:bg-orange-800 focus:ring-4 focus:ring-orange-300" onClick={handleButtonClick}>
                    <Hourglass className="mr-2 h-4 w-4" />
                    {/* cspell:disable-next-line */}
                    Mulai Proses
                </Button>
            );
        } else if (orderStatus === 'IN_PROCESS') {
            return (
                <Button className="bg-[#047857] text-[#FFFFFF] hover:bg-green-800 focus:ring-4 focus:ring-green-300" onClick={handleButtonClick}>
                    <Check className="mr-2 h-4 w-4" />
                    {/* cspell:disable-next-line */}
                    Tandai Selesai
                </Button>
            );
        } else if (orderStatus === 'FINISHED') {
            return (
                <Button className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300" onClick={handleButtonClick}>
                    <Truck className="mr-2 h-4 w-4" />
                    {/* cspell:disable-next-line */}
                    Tandai Diambil
                </Button>
            );
        }
        return null;
    };

    return (
        <div
            className={clsx('flex w-full items-center gap-6 overflow-hidden rounded-xl border border-[#E5E7EB] p-7 shadow-sm')}
            onClick={() => onClick(workOrder)}
        >
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
                    {formattedOrderDeadline}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    className="bg-[#E5E7EB] text-[#101828] hover:bg-gray-200 focus:ring-gray-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(workOrder);
                    }}
                >
                    <SquarePen className="mr-2 h-4 w-4" />
                    Edit
                </Button>
                <div className="w-[160px]">{renderActionButton(id, orderStatus)}</div>
            </div>
        </div>
    );
};

export default WorkOrderCard;
