import { WorkOrder } from '@/types/WorkOrder';
import { Head, router, usePage } from '@inertiajs/react';
import { Button, Checkbox, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Pagination, TextInput, Toast, ToastToggle } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';

import ConfirmationModal from '@/components/confirmation-modal';
import MarkAsDoneModal from '@/components/mark-as-done-modal';
import StatCard from '@/components/stat-card';
import WorkOrderCard from '@/components/work-order-card';
import WorkOrderDetailModal from '@/components/work-order-detail-modal';
import WorkOrderFormModal from '@/components/work-order-form-modal';
import AppLayout from '@/layouts/app-layout';
import { debounce } from 'lodash';
import { ArrowDownUp, ArrowDownZA, ArrowUpAZ, Check, ListFilter, Plus, Search, X } from 'lucide-react';

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
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isMarkAsDoneModalOpen, setIsMarkAsDoneModalOpen] = useState(false);

    const [editingOrder, setEditingOrder] = useState<Partial<WorkOrder> | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
    const [submittedOrder, setSubmittedOrder] = useState<Partial<WorkOrder> | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);

    const [search, setSearch] = useState(filters.search || '');
    const [sortColumn, setSortColumn] = useState(filters.column || 'order_deadline');
    const [sortDirection, setSortDirection] = useState(filters.direction || 'asc');
    const [filterStatus, setFilterStatus] = useState<string[]>(() => {
        if (!filters.status || filters.status === 'all') return [];
        return Array.isArray(filters.status) ? filters.status : [filters.status];
    });

    const { errors, flash } = usePage<{ errors: Record<string, string>; flash: { success?: string; error?: string } }>().props;

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

    const handleOpenConfirmModal = (order: WorkOrder) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(false);
        setIsConfirmModalOpen(true);
    };

    const handleOpenMarkAsDoneModal = (order: WorkOrder) => {
        setEditingOrder(order);
        setIsMarkAsDoneModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingOrder(null);
        setSubmittedOrder(null);
        router.get(
            window.location.pathname,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['errors'],
                replace: true,
            },
        );
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
    };

    const handleCloseMarkAsDoneModal = () => {
        setIsMarkAsDoneModalOpen(false);
        setEditingOrder(null);
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
                // preserveState: true,
                onError: (errors) => {
                    setSubmittedOrder(data);
                    setIsFormModalOpen(true);
                    console.log('Validation errors:', errors);
                },
                onSuccess: () => {
                    setSubmittedOrder(null);
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
                    setSubmittedOrder(data);
                    setIsFormModalOpen(true);
                    console.log('Validation errors:', errors);
                },
                onSuccess: () => {
                    setSubmittedOrder(null);
                    handleCloseFormModal();
                },
            });
        }
    };

    const handleConfirmDelete = () => {
        if (selectedOrder) {
            console.log('Deleting order:', selectedOrder);
            router.delete(route('work-orders.destroy', selectedOrder?.id), {
                onSuccess: () => {
                    setSelectedOrder(null);
                    setIsConfirmModalOpen(false);
                },
            });
        }
    };

    const handleMarkAsDoneClick = (workOrder: WorkOrder) => {
        if (workOrder.orderStatus === 'IN_PROCESS') {
            return handleOpenMarkAsDoneModal(workOrder);
        }

        setSelectedOrder(workOrder);

        router.patch(
            route('work-orders.markAsDone', workOrder.id),
            {},
            {
                onSuccess: () => {
                    setSelectedOrder(null);
                },
            },
        );
    };

    const handleMarkAsDoneSubmit = (price: number) => {
        const snakeCaseConvertedData: Record<string, any> = {
            order_cost: price,
        };

        router.patch(route('work-orders.markAsDone', editingOrder?.id), snakeCaseConvertedData, {
            onError: () => {},
            onSuccess: () => {
                handleCloseMarkAsDoneModal();
                setEditingOrder(null);
            },
        });
    };

    const handleCloseToast = () => {
        setShowToast(false);
        router.reload({ only: ['flash'] });
    };

    const getInitialData = () => {
        if (submittedOrder) {
            return submittedOrder;
        }
        return editingOrder;
    };

    useEffect(() => {
        setSearch(filters.search || '');
        setSortColumn(filters.column || 'order_deadline');
        setSortDirection(filters.direction || 'asc');
        const statusFilter = filters.status;
        if (!statusFilter) {
            setFilterStatus([]);
        } else {
            setFilterStatus(Array.isArray(statusFilter) ? statusFilter : [statusFilter]);
        }
        if (flash.success || flash.error) {
            setShowToast(true);
        }
    }, [filters, flash]);

    useEffect(() => {
        if (showToast && (flash.success || flash.error)) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    });

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
                                        Filter Status Pekerjaan
                                    </Button>
                                )}
                            >
                                <DropdownHeader>
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
                                        {getCurrentSortLabel()}
                                        <span className="text-xs text-gray-500">({sortDirection === 'asc' ? 'A-Z' : 'Z-A'})</span>
                                    </div>
                                }
                                color="gray"
                                size="sm"
                            >
                                <DropdownHeader>
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
                            <WorkOrderCard
                                key={order.id}
                                order={order}
                                onEdit={handleOpenEditModal}
                                onClick={handleOpenDetailModal}
                                onMarkAsDone={handleMarkAsDoneClick}
                            />
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center">
                        <Pagination
                            currentPage={workOrders.current_page}
                            totalPages={workOrders.last_page}
                            onPageChange={handlePageChange}
                            previousLabel='Sebelumnya'
                            nextLabel='Selanjutnya'
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

            <WorkOrderDetailModal
                show={isDetailModalOpen}
                workOrder={selectedOrder}
                onClose={handleCloseDetailModal}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenConfirmModal}
            />

            <ConfirmationModal
                show={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Konfirmasi Hapus Pekerjaan"
                confirmText="Hapus"
            >
                Apakah Anda yakin ingin menghapus pekerjaan untuk pelanggan
                <span className="font-bold"> {selectedOrder?.orderTitle}</span>? Tindakan ini tidak dapat dibatalkan.
            </ConfirmationModal>

            <MarkAsDoneModal
                show={isMarkAsDoneModalOpen}
                order={editingOrder}
                onClose={() => setIsMarkAsDoneModalOpen(false)}
                onSubmit={handleMarkAsDoneSubmit}
            />

            {showToast && flash.success && (
                <Toast className="fixed top-16 left-1/2 z-50 -translate-x-1/2">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <Check className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{flash.success}</div>
                    <ToastToggle onDismiss={handleCloseToast} />
                </Toast>
            )}

            {showToast && flash.error && (
                <Toast className="fixed top-4 right-4 z-50">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <X className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{flash.error}</div>
                    <ToastToggle onDismiss={handleCloseToast} />
                </Toast>
            )}
        </>
    );
};

export default WorkOrderIndex;
