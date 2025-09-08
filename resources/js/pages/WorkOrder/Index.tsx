import { WorkOrder } from '@/types/WorkOrder';
import { Head, router } from '@inertiajs/react';
import { Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Pagination, TextInput } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';

import StatCard from '@/components/StatCard';
import WorkOrderCard from '@/components/WorkOrderCard';
import WorkOrderModal from '@/components/WorkOrderModal';
import AppLayout from '@/layouts/AppLayout';
import {  ArrowDownUp, ArrowDownZA, ArrowUpAZ, Plus, Search } from 'lucide-react';
import { debounce } from 'lodash';

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
    filters: {
        search: string;
        status: string;
        column: string;
        direction: string;
    };
}

const WorkOrderIndex: React.FC<WorkOrderIndexProps> = ({ stats, workOrders, filters }) => {
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Partial<WorkOrder> | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [sortColumn, setSortColumn] = useState(filters.column || 'created_at');
    const [sortDirection, setSortDirection] = useState(filters.direction || 'desc');

    const sortOptions = [
        { value: 'created_at', label: 'Tanggal Dibuat' },
        { value: 'order_deadline', label: 'Deadline' },
        { value: 'customer_name', label: 'Nama Pelanggan' },
        { value: 'order_title', label: 'Judul Pekerjaan' },
        { value: 'order_status', label: 'Status' },
    ];

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

    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            router.get(
                window.location.pathname,
                {
                    search: searchTerm,
                    column: sortColumn,
                    direction: sortDirection,
                    status: filters.status || 'ALL',
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300),
        [sortColumn, sortDirection, filters.status],
    );

    const getCurrentSortLabel = () => {
        const option = sortOptions.find((opt) => opt.value === sortColumn);

        return option ? option.label : 'Tanggal Dibuat';
    };

    const getSortIcon = () => {
        if (sortDirection === 'asc') return <ArrowUpAZ className="h-4 w-4 mr-2" />;
        if (sortDirection === 'desc') return <ArrowDownZA className="h-4 w-4 mr-2" />;
        return <ArrowDownUp className="h-4 w-4 mr-2" />;
    };

    const handleSortChange = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);

        router.get(
            window.location.pathname,
            {
                search: search,
                column: column,
                direction: newDirection,
                status: filters.status || 'ALL',
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const toggleSortDirection = () => {
        handleSortChange(sortColumn);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const handlePageChange = (page: number) => {
        router.get(
            window.location.pathname,
            {
                search: search,
                column: sortColumn,
                direction: sortDirection,
                status: filters.status || 'ALL',
                page: page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
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

    useEffect(() => {
        setSearch(filters.search || '');
        setSortColumn(filters.column || 'created_at');
        setSortDirection(filters.direction || 'desc');
    }, [filters]);

    return (
        <>
            <AppLayout>
                <Head title="Antrian Pekerjaan" />
                <div className="px-28 py-4">
                    <div className="flex items-center justify-end gap-3 pb-4">
                        <StatCard title="Antrian Kerja" value={stats.queueCount} />
                        <StatCard title="Penghasilan Hari Ini" value={stats.dailyRevenue} />
                    </div>
                    <div className="flex items-center justify-between px-7 py-4">
                        <h1 className="text-xl font-bold text-[#101828]">Antrian Pekerjaan</h1>
                        <div className="flex items-center gap-4">
                            <TextInput
                                id="search"
                                type="text"
                                icon={Search}
                                placeholder="Cari"
                                value={search}
                                onChange={handleSearch}
                                className="w-96"
                                sizing="md"
                            />

                            <Dropdown
                                renderTrigger={() => (
                                    <Button className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                                        {getSortIcon()}
                                        {/* cspell:disable-next-line */}
                                        {getCurrentSortLabel()}
                                    </Button>
                                )}
                                label={
                                    <div className="flex items-center gap-2">
                                        {getSortIcon()}
                                        {/* cspell:disable-next-line */}
                                        {getCurrentSortLabel()}
                                        <span className="text-xs text-gray-500">({sortDirection === 'asc' ? 'A-Z' : 'Z-A'})</span>
                                    </div>
                                }
                                color="gray"
                                size="sm"
                            >
                                <DropdownHeader>
                                    {/* cspell:disable-next-line */}
                                    <span className="block text-sm font-semibold">Pilih Kolom:</span>
                                </DropdownHeader>

                                {sortOptions.map((option) => (
                                    <DropdownItem
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={sortColumn === option.value ? 'bg-blue-50 text-blue-600' : ''}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <span className={sortColumn === option.value ? 'font-medium' : ''}>{option.label}</span>
                                            {sortColumn === option.value && getSortIcon()}
                                        </div>
                                    </DropdownItem>
                                ))}

                                <DropdownDivider />

                                <DropdownItem onClick={toggleSortDirection}>
                                    <div className="flex items-center gap-2">
                                        {getSortIcon()}
                                        {/* cspell:disable-next-line */}
                                        <span>Toggle Arah: {sortDirection === 'asc' ? 'A-Z → Z-A' : 'Z-A → A-Z'}</span>
                                    </div>
                                </DropdownItem>
                            </Dropdown>

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
                        {workOrders.data.map((order) => (
                            <WorkOrderCard key={order.id} order={order} onEdit={handleOpenEditModal} />
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center">
                        <Pagination
                            currentPage={workOrders.current_page}
                            totalPages={workOrders.last_page}
                            onPageChange={handlePageChange}
                            showIcons
                        />
                    </div>
                </div>
            </AppLayout>
            <WorkOrderModal show={isModalOpen} onClose={handleCloseModal} mode={modalMode} onSubmit={handleSubmit} initialData={editingOrder} />
        </>
    );
};

export default WorkOrderIndex;
