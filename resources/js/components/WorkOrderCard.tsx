// resources/js/Components/WorkOrderCard.tsx
import clsx from 'clsx';
import { Badge, Button } from 'flowbite-react';
import React from 'react';
import { IconType } from 'react-icons';
import { HiCheck, HiOutlineCalendar, HiOutlineExclamation, HiOutlineExclamationCircle, HiOutlinePencil } from 'react-icons/hi';

type Priority = 'low' | 'medium' | 'high';

export interface WorkOrder {
    id: number;
    name: string;
    job: string;
    deadline: string;
    priority: Priority;
}

interface WorkOrderCardProps {
    order: WorkOrder;
}

// Updated mapping to use direct hex values for dynamic styling
const priorityStyles: Record<Priority, { bgColor: string; iconColor: string; Icon: IconType }> = {
    low: { bgColor: 'bg-[#ECFDF5]', iconColor: 'text-[#004F3B]', Icon: HiCheck },
    medium: { bgColor: 'bg-[#FFF8F1]', iconColor: 'text-[#B54708]', Icon: HiOutlineExclamationCircle },
    high: { bgColor: 'bg-[#FEF0F2]', iconColor: 'text-[#B42318]', Icon: HiOutlineExclamation },
};

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ order }) => {
    const { name, job, deadline, priority } = order;
    const styles = priorityStyles[priority];

    return (
        <div className={clsx('flex w-full items-center gap-6 overflow-hidden rounded-xl border border-[#E5E7EB] p-7 shadow-sm', styles.bgColor)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <styles.Icon className={clsx('h-5 w-5', styles.iconColor)} />
            </div>

            <div className="flex-1">
                <h3 className="text-2xl font-semibold text-[#101828]">{name}</h3>
                <p className="text-base text-[#4A5565]">{job}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
                <span className="text-base text-[#4A5565]">Deadline</span>
                <Badge color="gray" icon={HiOutlineCalendar} size="sm">
                    {deadline}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                {/* Replaced Button 'color' prop with 'className' for precise styling */}
                <Button size="xs" className="bg-[#E5E7EB] text-[#101828] hover:bg-gray-200 focus:ring-gray-300">
                    <HiOutlinePencil className="mr-2 h-3 w-3" />
                    Edit
                </Button>
                <Button className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                    <HiCheck className="mr-2 h-4 w-4" />
                    Tandai Selesai
                </Button>
            </div>
        </div>
    );
};

export default WorkOrderCard;
