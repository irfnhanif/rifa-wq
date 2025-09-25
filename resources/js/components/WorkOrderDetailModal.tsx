// resources/js/components/WorkOrderDetailModal.tsx
import { Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Activity, CalendarDays, FileText, Layers, LucideIcon, NotepadText, Phone, Ruler, SquarePen, Trash2, User, Wallet } from 'lucide-react';
import React from 'react';
import { WorkOrder } from '../types/WorkOrder';

// A small helper component to keep the detail display clean and consistent
interface DetailItemProps {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
    className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, className }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-[#6A7282]" />
            <span className="text-sm text-[#6A7282]">{label}</span>
        </div>
        <div className="font-medium text-[#4A5565]">{value || '-'}</div>
    </div>
);

interface WorkOrderDetailModalProps {
    show: boolean;
    workOrder: WorkOrder | null;
    onClose: () => void;
    onEdit: (workOrder: WorkOrder) => void;
    onDelete: (workOrder: WorkOrder) => void;
}

const WorkOrderDetailModal: React.FC<WorkOrderDetailModalProps> = ({ show, workOrder, onClose, onEdit, onDelete }) => {
    if (!workOrder) return null;

    const statusLabelOptions = new Map([
        ['PENDING', 'Ditunda'],
        ['IN_PROCESS', 'Dalam Proses'],
        ['FINISHED', 'Selesai'],
        ['PICKED_UP', 'Sudah Diambil'],
    ]);

    const formattedOrderDeadline = new Date(workOrder.orderDeadline).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const diffDays = Math.ceil((new Date(workOrder.orderDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const daysRemainingBadgeColor = diffDays > 0 ? 'success' : diffDays === 0 ? 'warning' : 'failure';
    const daysRemainingText = diffDays > 0 ? `${diffDays} hari lagi` : diffDays === 0 ? 'Hari ini' : `${Math.abs(diffDays)} hari lewat`;

    return (
        <Modal show={show} size="5xl" onClose={onClose} popup>
            <ModalHeader className="m-3 border-b border-[#E5E7EB]">Detail Pekerjaan</ModalHeader>
            <ModalBody className="py-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 border-b border-[#E5E7EB] pb-6">
                        <div className="flex flex-col gap-6">
                            <DetailItem icon={User} label="Nama Pelanggan" value={workOrder.customerName} />
                            <DetailItem icon={Phone} label="Nomor WhatsApp" value={workOrder.whatsappNumber} />
                        </div>
                        <div className="flex flex-col gap-6">
                            <DetailItem icon={FileText} label="Judul Pekerjaan" value={workOrder.orderTitle} />
                            <DetailItem icon={NotepadText} label="Deskripsi" value={workOrder.orderDescription || '-'} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 border-b border-[#E5E7EB] pb-6">
                        <div className="flex flex-col gap-6">
                            <DetailItem icon={Ruler} label="Ukuran" value={workOrder.printingSize} />
                            <DetailItem icon={Layers} label="Bahan" value={workOrder.printingMaterial} />
                        </div>
                        <div className="flex flex-col gap-6">
                            <DetailItem
                                icon={CalendarDays}
                                label="Deadline"
                                value={
                                    <div className="flex items-center gap-4">
                                        <span>{formattedOrderDeadline}</span>
                                        <Badge color={daysRemainingBadgeColor}>{daysRemainingText}</Badge>
                                    </div>
                                }
                            />
                            <DetailItem icon={Activity} label="Status" value={statusLabelOptions.get(workOrder.orderStatus)} />
                        </div>
                    </div>

                    <div>
                        <DetailItem
                            icon={Wallet}
                            label="Biaya Pekerjaan"
                            value={workOrder.orderCost ? `Rp${workOrder.orderCost.toLocaleString('id-ID')}` : '-'}
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className="justify-start border-t border-[#E5E7EB]">
                <Button onClick={() => onEdit(workOrder)} className="bg-[#E5E7EB] text-[#4A5565] hover:bg-gray-200">
                    <SquarePen className="mr-2 h-4 w-4" />
                    Edit
                </Button>
                <Button onClick={() => onDelete(workOrder)} className="bg-[#FF5A1F] text-[#FFFFFF] hover:bg-orange-600 focus:ring-orange-300">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default WorkOrderDetailModal;
