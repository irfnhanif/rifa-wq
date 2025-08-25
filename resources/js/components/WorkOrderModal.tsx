// resources/js/components/WorkOrderModal.tsx
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Save } from 'lucide-react';
import React from 'react';
import { WorkOrder } from '@/types/WorkOrder';
import WorkOrderForm from './WorkOrderForm';

interface WorkOrderModalProps {
    mode: 'add' | 'edit';
    show: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<WorkOrder>) => void;
    initialData?: Partial<WorkOrder> | null;
}

const WorkOrderModal: React.FC<WorkOrderModalProps> = ({ mode, show, onClose, onSubmit, initialData }) => {
    const title = mode === 'add' ? 'Tambah Pekerjaan Baru' : 'Edit Pekerjaan';
    const submitButtonText = mode === 'add' ? 'Tambah Pekerjaan' : 'Simpan Perubahan';

    return (
        <Modal show={show} size="3xl" onClose={onClose} popup>
            <ModalHeader className="border-b border-[#E5E7EB]">{title}</ModalHeader>
            <ModalBody>
                <WorkOrderForm initialData={initialData} onSubmit={onSubmit} onCancel={onClose} />
            </ModalBody>
            <ModalFooter className="border-t border-[#E5E7EB]">
                <Button
                    type="submit"
                    form="work-order-form"
                    className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {submitButtonText}
                </Button>
                <Button onClick={onClose} className="bg-[#E5E7EB] text-[#4A5565] hover:bg-gray-200">
                    Batalkan
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default WorkOrderModal;
