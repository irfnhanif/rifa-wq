// resources/js/Pages/WorkQueue/Index.tsx
import { Head, router } from '@inertiajs/react';
import { Button, Dropdown, DropdownItem, Pagination } from 'flowbite-react';
import React from 'react';

// Import Components and Types
import StatCard from '@/components/StatCard';
import WorkOrderCard, { WorkOrder } from '@/components/WorkOrderCard';
import AppLayout from '@/layouts/AppLayout';
import { ArrowDownUp, Plus } from 'lucide-react';

// Define types for data passed from the backend
interface Stats {
    queueCount: number;
    dailyRevenue: string;
}

interface PaginatedWorkOrders {
    current_page: number;
    last_page: number;
    data: WorkOrder[];
    // Include other pagination properties from Laravel as needed
}

interface WorkOrderIndexProps {
    stats: Stats;
    workOrders: PaginatedWorkOrders;
}

// Mock data to simulate what Inertia would pass from the backend
const mockStats: Stats = {
    queueCount: 36,
    dailyRevenue: 'Rp 2.500.000',
};

const mockWorkOrders: PaginatedWorkOrders = {
    current_page: 3,
    last_page: 10,
    data: [
        { id: 1, name: 'Andi Sumandi', job: 'Desain Banner Wisuda', deadline: '19 Agu 2025', status: 'PENDING' },
        { id: 2, name: 'Anto Sumanto', job: 'Fotokopi KTP', deadline: '19 Agu 2025', status: 'PROCESSED' },
        { id: 3, name: 'Andi Sumandi', job: 'Print Stiker', deadline: '19 Agu 2025', status: 'FINISHED' },
        { id: 4, name: 'Bang Naren', job: 'Print Keychain', deadline: '22 Agu 2025', status: 'PICKED_UP' },
    ],
};

const WorkOrderIndex: React.FC<WorkOrderIndexProps> = ({ stats = mockStats, workOrders = mockWorkOrders }) => {
    const onPageChange = (page: number) => {
        // Use Inertia's router to visit the new page, preserving query strings
        router.get(window.location.pathname, { page }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Antrian Pekerjaan" />
            <div className="px-28 py-4">
                <div className="flex justify-end items-center gap-3 pb-4">
                    <StatCard title="Antrian Kerja" value={stats.queueCount} />
                    <StatCard title="Penghasilan Hari Ini" value={stats.dailyRevenue} />
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center px-7 py-4">
                        <h1 className="text-xl font-bold text-[#101828]">Semua Pekerjaan</h1>
                        <div className="flex items-center gap-4">
                            <Button className="bg-[#FFFFFF] text-[#4A5565] border border-[#E5E7EB] hover:bg-gray-100 focus:ring-gray-200">
                                <ArrowDownUp className="mr-2 h-4 w-4" />
                                Berdasarkan Deadline
                            </Button>
                            <Button className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {workOrders.data.map((order) => <WorkOrderCard key={order.id} order={order} />)}
                    </div>
                    <div className="flex justify-center items-center gap-4 py-4 mt-4">
                        <Pagination
                            currentPage={workOrders.current_page}
                            totalPages={workOrders.last_page}
                            onPageChange={onPageChange}
                            showIcons
                        />
                         <Dropdown label="10 per halaman" color="gray" dismissOnClick={false}>
                            <DropdownItem>10 per halaman</DropdownItem>
                            <DropdownItem>20 per halaman</DropdownItem>
                            <DropdownItem>50 per halaman</DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default WorkOrderIndex;
