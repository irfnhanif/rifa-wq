import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from 'flowbite-react';
import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { WorkOrder } from '../types/WorkOrder';

const Required = () => <span className="text-[#C70036]">*</span>;

interface MarkAsDoneModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (price: number) => void;
    order: Partial<WorkOrder> | null;
}

const MarkAsDoneModal: React.FC<MarkAsDoneModalProps> = ({ show, onClose, onSubmit, order }) => {
    const [displayPrice, setDisplayPrice] = useState('');
    const [numericPrice, setNumericPrice] = useState(0);

    const formatIDR = (value: number): string => {
        if (value === 0) return '';
        return value.toLocaleString('id-ID');
    };

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        const digitsOnly = input.replace(/[^\d]/g, '');
        const numPrice = parseInt(digitsOnly) || 0;

        setNumericPrice(numPrice);
        setDisplayPrice(formatIDR(numPrice));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof numericPrice === 'number' && numericPrice > 0) {
            onSubmit(numericPrice);
            setNumericPrice(0);
            setDisplayPrice('');
        }
    };

    return (
        <Modal show={show} size="xl" onClose={onClose} popup>
            <ModalHeader className="m-3 border-b border-[#E5E7EB]">Selesai Mengerjakan?</ModalHeader>
            <ModalBody>
                <form id="mark-as-done-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <p className="text-base text-[#4A5565]">
                        Masukkan biaya untuk pekerjaan <span className="font-semibold">{order?.orderTitle}</span> milik
                        <span className="font-semibold">{order?.customerName}</span>.
                    </p>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="price">
                                Biaya Pekerjaan <Required />
                            </Label>
                        </div>
                        <TextInput
                            id="orderCost"
                            name="orderCost"
                            type="text"
                            value={displayPrice}
                            onChange={handlePriceInput}
                            placeholder="0"
                            required
                            addon="Rp"
                        />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter className="border-t border-[#E5E7EB]">
                <Button
                    type="submit"
                    form="mark-as-done-form"
                    className="bg-[#1447E6] text-[#FFFFFF] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Selesaikan Pekerjaan
                </Button>
                <Button onClick={onClose} className="bg-[#E5E7EB] text-[#4A5565] hover:bg-gray-200">
                    Batalkan
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default MarkAsDoneModal;
