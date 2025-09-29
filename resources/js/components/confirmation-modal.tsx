import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { AlertTriangle, LucideIcon } from 'lucide-react';
import React from 'react';

interface ConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    confirmText: string;
    children: React.ReactNode;
    icon?: LucideIcon;
    confirmColor?: 'primary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    show,
    onClose,
    onConfirm,
    title,
    confirmText,
    children,
    icon: Icon = AlertTriangle,
    confirmColor = 'danger',
}) => {
    const confirmButtonStyles = {
        primary: 'bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-blue-300',
        danger: 'bg-[#FF1F1F] text-[#FFFFFF] hover:bg-orange-600 focus:ring-red-300',
    };

    return (
        <Modal show={show} size="md" onClose={onClose} popup>
            <ModalHeader />
            <ModalBody>
                <div className="text-center">
                    <Icon className="mx-auto mb-4 h-14 w-14 text-[#6A7282]" />
                    <h3 className="mb-5 text-lg font-semibold text-[#101828]">{title}</h3>
                    <div className="mb-5 text-base text-[#4A5565]">{children}</div>
                    <div className="flex justify-center gap-4">
                        <Button className={confirmButtonStyles[confirmColor]} onClick={onConfirm}>
                            {confirmText}
                        </Button>
                        <Button className="bg-[#E5E7EB] text-[#4A5565] hover:bg-gray-200" onClick={onClose}>
                            Batalkan
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ConfirmationModal;
