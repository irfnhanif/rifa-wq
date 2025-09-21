import { WorkOrder } from '@/types/WorkOrder';
import { Head, router, usePage } from '@inertiajs/react';
import { Button, Checkbox, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Pagination, TextInput } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';

import StatCard from '@/components/StatCard';
import WorkOrderCard from '@/components/WorkOrderCard';
import WorkOrderDetailModal from '@/components/WorkOrderDetailModal';
import WorkOrderFormModal from '@/components/WorkOrderFormModal';
import AppLayout from '@/layouts/AppLayout';
import { debounce } from 'lodash';
import { ArrowDownUp, ArrowDownZA, ArrowUpAZ, ListFilter, Plus, Search } from 'lucide-react';

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
    const [formModalMode, setFormModalMode] = useState<'add' | 'edit'>('add');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Partial<WorkOrder> | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);

    const [submittedData, setSubmittedData] = useState<Partial<WorkOrder> | null>(null);
    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [sortColumn, setSortColumn] = useState(filters.column || 'order_deadline');
    const [sortDirection, setSortDirection] = useState(filters.direction || 'asc');
    const [filterStatus, setFilterStatus] = useState<string[]>(() => {
        if (!filters.status || filters.status === 'all') return [];
        return Array.isArray(filters.status) ? filters.status : [filters.status];
    });

    const sortOptions = [
        { value: 'order_deadline', label: 'Deadline' },
        { value: 'customer_name', label: 'Nama Pelanggan' },
        { value: 'order_title', label: 'Judul Pekerjaan' },
        { value: 'order_status', label: 'Status' },
    ];

    const filterOptions = [
        { value: 'PENDING', label: 'Ditunda' },
        { value: 'IN_PROCESS', label: 'Dalam Proses' },
        { value: 'FINISHED', label: 'Selesai' },
        { value: 'PICKED_UP', label: 'Sudah Diambil' },
    ];

    const handleOpenAddModal = () => {
        handleCloseDetailModal();
        setIsDetailModalOpen(false);
        setFormModalMode('add');
        setEditingOrder(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (order: WorkOrder) => {
        handleCloseDetailModal();
        setFormModalMode('edit');
        setEditingOrder(order);
        setIsFormModalOpen(true);
    };

    const handleOpenDetailModal = (order: WorkOrder) => {
        handleCloseFormModal();
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingOrder(null);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
    };

    const getCurrentSortLabel = () => {
        const option = sortOptions.find((opt) => opt.value === sortColumn);

        return option ? option.label : 'Tanggal Dibuat';
    };

    const getSortIcon = () => {
        if (sortDirection === 'asc') return <ArrowUpAZ className="mr-2 h-4 w-4" />;
        if (sortDirection === 'desc') return <ArrowDownZA className="mr-2 h-4 w-4" />;
        return <ArrowDownUp className="mr-2 h-4 w-4" />;
    };

    const toggleSortDirection = () => {
        handleSortChange(sortColumn);
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
                status: filterStatus.length === 0 ? '' : filterStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleFilterChange = (status: string) => {
        let newFilterStatus: string[];

        if (filterStatus.includes(status)) {
            newFilterStatus = filterStatus.filter((s) => s !== status);
        } else {
            newFilterStatus = [...filterStatus, status];
        }

        setFilterStatus(newFilterStatus);

        router.get(
            window.location.pathname,
            {
                search: search,
                column: sortColumn,
                direction: sortDirection,
                status: newFilterStatus.length === 0 ? '' : newFilterStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            router.get(
                window.location.pathname,
                {
                    search: searchTerm,
                    column: sortColumn,
                    direction: sortDirection,
                    status: filterStatus.length === 0 ? '' : filterStatus,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300),
        [sortColumn, sortDirection, filterStatus],
    );

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
                status: filterStatus.length === 0 ? '' : filterStatus,
                page: page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSubmit = (data: Partial<WorkOrder>) => {
        const snakeCaseConvertedData: Record<string, any> = {
            customer_name: data.customerName,
            whatsapp_number: data.whatsappNumber,
            order_title: data.orderTitle,
            order_description: data.orderDescription || null,
            printing_size: data.printingSize,
            printing_material: data.printingMaterial,
            order_deadline: data.orderDeadline,
        };

        if (formModalMode === 'add') {
            router.post(route('work-orders.store'), snakeCaseConvertedData, {
                preserveState: true,
                onError: (errors) => {
                    setSubmittedData(data);
                    setIsFormModalOpen(true);
                    console.log('Validation errors:', errors);
                },
                onSuccess: () => {
                    setSubmittedData(null);
                    handleCloseFormModal();
                },
            });
        } else {
            if (data.orderStatus !== undefined && data.orderStatus !== null) {
                snakeCaseConvertedData.order_status = data.orderStatus;
            }

            if (data.orderCost !== undefined) {
                snakeCaseConvertedData.order_cost = data.orderCost === null ? null : Number(data.orderCost);
            }

            router.put(route('work-orders.update', editingOrder?.id), snakeCaseConvertedData, {
                onError: (errors) => {
                    setSubmittedData(data);
                    setIsFormModalOpen(true);
                    console.log('Validation errors:', errors);
                },
                onSuccess: () => {
                    setSubmittedData(null);
                    handleCloseFormModal();
                },
            });
        }

        handleCloseFormModal();
    };

    const getInitialData = () => {
        if (submittedData) {
            return submittedData;
        }
        return editingOrder;
    };

    useEffect(() => {
        setSearch(filters.search || '');
        setSortColumn(filters.column || 'created_at');
        setSortDirection(filters.direction || 'desc');
        const statusFilter = filters.status;
        if (!statusFilter) {
            setFilterStatus([]);
        } else {
            setFilterStatus(Array.isArray(statusFilter) ? statusFilter : [statusFilter]);
        }
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
                                    <Button className="border-2 border-[#1447E6] bg-transparent text-[#1447E6] transition-colors hover:bg-[#1447E6] hover:text-white focus:ring-4 focus:ring-blue-300">
                                        <ListFilter className="mr-2 h-4 w-4" />
                                        {/* cspell:disable-next-line */}
                                        Filter Status Pekerjaan
                                    </Button>
                                )}
                            >
                                <DropdownHeader>
                                    {/* cspell:disable-next-line */}
                                    <span className="block text-sm font-semibold">Filter Status:</span>
                                </DropdownHeader>

                                {filterOptions.map((option) => (
                                    <DropdownItem key={option.value} className="p-0">
                                        <div className="flex w-full items-center p-2">
                                            <Checkbox
                                                id={`filter-${option.value}`}
                                                checked={filterStatus.includes(option.value)}
                                                onChange={() => handleFilterChange(option.value)}
                                                className="mr-3"
                                            />
                                            <label htmlFor={`filter-${option.value}`} className="flex-1 cursor-pointer text-left text-sm">
                                                {option.label}
                                            </label>
                                        </div>
                                    </DropdownItem>
                                ))}
                            </Dropdown>

                            <Dropdown
                                renderTrigger={() => (
                                    <Button className="border-2 border-[#1447E6] bg-transparent text-[#1447E6] transition-colors hover:bg-[#1447E6] hover:text-white focus:ring-4 focus:ring-blue-300">
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
                                    <span className="block text-sm font-semibold">Berdasarkan:</span>
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
                                        <span>Arah Urutan: {sortDirection === 'asc' ? 'A-Z → Z-A' : 'Z-A → A-Z'}</span>
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
                            <WorkOrderCard key={order.id} order={order} onEdit={handleOpenEditModal} onClick={handleOpenDetailModal} />
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
            <WorkOrderFormModal
                show={isFormModalOpen}
                onClose={handleCloseFormModal}
                mode={formModalMode}
                onSubmit={handleSubmit}
                initialData={getInitialData()}
                errors={errors}
            />
            <WorkOrderDetailModal show={isDetailModalOpen} workOrder={selectedOrder} onClose={handleCloseDetailModal} onEdit={handleOpenEditModal} />
        </>
    );
};

export default WorkOrderIndex;
