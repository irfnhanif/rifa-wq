// resources/js/components/WorkOrderModal.tsx
import { WorkOrder } from '@/types/WorkOrder';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Save } from 'lucide-react';
import React from 'react';
import WorkOrderForm from './work-order-form';

interface WorkOrderFormModalProps {
    mode: 'add' | 'edit';
    show: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<WorkOrder>) => void;
    initialData?: Partial<WorkOrder> | null;
    errors?: Record<string, string>;
}

const WorkOrderFormModal: React.FC<WorkOrderFormModalProps> = ({ mode, show, onClose, onSubmit, initialData, errors = {} }) => {
    const title = mode === 'add' ? 'Tambah Pekerjaan Baru' : 'Edit Pekerjaan';
    const submitButtonText = mode === 'add' ? 'Tambah Pekerjaan' : 'Simpan Perubahan';
    const formMethod = mode === 'add' ? 'POST' : 'PUT';

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Modal show={show} size="3xl" onClose={onClose} popup>
            <ModalHeader className="m-3 border-b border-[#E5E7EB]">{title}</ModalHeader>
            <ModalBody>
                {hasErrors && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                        <h3 className="text-sm font-medium text-red-800">Terdapat kesalahan pada data yang dimasukkan</h3>
                    </div>
                )}
                <WorkOrderForm initialData={initialData} onSubmit={onSubmit} formMethod={formMethod} errors={errors}/>
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

export default WorkOrderFormModal;
