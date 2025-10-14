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
            <ModalHeader className="m-3 border-b border-gray-200 dark:border-gray-700">{title}</ModalHeader>
            <ModalBody>
                {hasErrors && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Terdapat kesalahan pada data yang dimasukkan</h3>
                    </div>
                )}
                <WorkOrderForm initialData={initialData} onSubmit={onSubmit} formMethod={formMethod} errors={errors}/>
            </ModalBody>
            <ModalFooter className="border-t border-gray-200 dark:border-gray-700">
                <Button
                    type="submit"
                    form="work-order-form"
                    className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {submitButtonText}
                </Button>
                <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    Batalkan
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default WorkOrderFormModal;
