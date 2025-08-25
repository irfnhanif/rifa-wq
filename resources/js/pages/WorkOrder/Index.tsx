import { WorkOrder } from '@/types/WorkOrder';
import { Head, router } from '@inertiajs/react';
import { Button, Dropdown, DropdownItem, Pagination } from 'flowbite-react';
import React, { useState } from 'react';

import StatCard from '@/components/StatCard';
import WorkOrderCard from '@/components/WorkOrderCard';
import WorkOrderModal from '@/components/WorkOrderModal';
import AppLayout from '@/layouts/AppLayout';
import { ArrowDownUp, Plus } from 'lucide-react';

interface Stats {
    queueCount: number;
    dailyRevenue: string;
}
interface PaginatedWorkOrders {
    current_page: number;
    last_page: number;
    data: WorkOrder[];
}
interface WorkOrderIndexProps {
    stats: Stats;
    workOrders: PaginatedWorkOrders;
}

const WorkOrderIndex: React.FC<WorkOrderIndexProps> = ({ stats, workOrders }) => {
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Partial<WorkOrder> | null>(null);

    const onPageChange = (page: number) => {
        router.get(window.location.pathname, { page }, { preserveState: true });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setEditingOrder(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (order: WorkOrder) => {
        setModalMode('edit');
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOrder(null);
    };

    const handleSubmit = (data: Partial<WorkOrder>) => {
        if (modalMode === 'add') {
            console.log('Adding new order:', data);
            // router.post('/work-orders', data);
        } else {
            console.log('Updating order:', data);
            // router.put(`/work-orders/${editingOrder?.id}`, data);
        }
        handleCloseModal();
    };

    return (
        <AppLayout>
            <Head title="Antrian Pekerjaan" />
            <div className="px-28 py-4">
                <div className="flex items-center justify-end gap-3 pb-4">
                    <StatCard title="Antrian Kerja" value={stats.queueCount} />
                    <StatCard title="Penghasilan Hari Ini" value={stats.dailyRevenue} />
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between px-7 py-4">
                        <h1 className="text-xl font-bold text-[#101828]">Semua Pekerjaan</h1>
                        <div className="flex items-center gap-4">
                            <Button className="border border-[#E5E7EB] bg-[#FFFFFF] text-[#4A5565] hover:bg-gray-100 focus:ring-gray-200">
                                <ArrowDownUp className="mr-2 h-4 w-4" />
                                Berdasarkan Deadline
                            </Button>
                            {/* This button now opens the modal */}
                            <Button
                                onClick={handleOpenAddModal}
                                className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* Pass the edit handler to each card */}
                        {workOrders.data.map((order) => (
                            <WorkOrderCard key={order.id} order={order} onEdit={handleOpenEditModal}/>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4 py-4">
                        <Pagination currentPage={workOrders.current_page} totalPages={workOrders.last_page} onPageChange={onPageChange} showIcons />
                        <Dropdown label="10 per halaman" color="gray" dismissOnClick={false}>
                            <DropdownItem>10 per halaman</DropdownItem>
                            <DropdownItem>20 per halaman</DropdownItem>
                            <DropdownItem>50 per halaman</DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <WorkOrderModal show={isModalOpen} onClose={handleCloseModal} mode={modalMode} onSubmit={handleSubmit} initialData={editingOrder} />
        </AppLayout>
    );
};

export default WorkOrderIndex;
