// resources/js/components/WorkOrderForm.tsx
import { WorkOrder } from '@/types/WorkOrder';
import { Datepicker, Label, Select, TextInput, Textarea } from 'flowbite-react';
import { CalendarDays, Phone, Printer, Ruler, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Required = () => <span className="text-[#C70036]">*</span>;

interface WorkOrderFormProps {
    initialData?: Partial<WorkOrder> | null;
    onSubmit: (data: Partial<WorkOrder>) => void;
    onCancel: () => void;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<WorkOrder>>({
        customerName: '',
        whatsappNumber: '',
        orderTitle: '',
        printingSize: '',
        printingMaterial: '',
        orderDeadline: new Date(),
        orderDescription: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        if (!date) {
            return;
        }
        setFormData((prev) => ({ ...prev, deadline: date.toISOString() }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form id="work-order-form" onSubmit={handleSubmit} className="my-3 flex flex-col gap-4">
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="customerName">
                        Nama Pelanggan <Required />
                    </Label>
                </div>
                <TextInput
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Isi nama pelanggan disini"
                    icon={User}
                    required
                />
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="whatsappNumber">
                        No. Whatsapp <Required />
                    </Label>
                </div>
                <TextInput
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="Isi nomor WA pelanggan disini"
                    icon={Phone}
                    required
                />
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="orderTitle">
                        Judul Orderan <Required />
                    </Label>
                </div>
                <TextInput
                    id="orderTitle"
                    name="orderTitle"
                    value={formData.orderTitle}
                    onChange={handleChange}
                    placeholder="Isi judul order disini"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="printingSize">
                            Ukuran <Required />
                        </Label>
                    </div>
                    <TextInput
                        id="printingSize"
                        name="printingSize"
                        value={formData.printingSize}
                        onChange={handleChange}
                        placeholder="Ukuran cetak desain (Contoh: 6x4 m)"
                        icon={Ruler}
                        required
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="printingMaterial">
                            Cetak Bahan Apa <Required />
                        </Label>
                    </div>
                    <Select
                        id="printingMaterial"
                        name="printingMaterial"
                        value={formData.printingMaterial}
                        onChange={handleChange}
                        icon={Printer}
                        className="w-full"
                        required
                    >
                        <option>HVS</option>
                        <option>Flexi</option>
                        <option>Sticker</option>
                    </Select>
                </div>
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="orderDeadline">
                        Deadline <Required />
                    </Label>
                </div>
                <Datepicker
                    id="orderDeadline"
                    name="orderDeadline"
                    value={formData.orderDeadline}
                    onChange={handleDateChange}
                    icon={CalendarDays}
                    required
                />
            </div>

            <div>
                <div className="mb-2 flex justify-between">
                    <Label htmlFor="orderDescription">Deskripsi Tambahan</Label>
                    <span className="text-xs text-[#6A7282]">Opsional</span>
                </div>
                <Textarea id="orderDescription" name="orderDescription" placeholder="Tulis deskripsi tambahan disini..." rows={4} />
            </div>
            <p className="text-sm font-medium text-[#4A5565]">Harga dapat dimasukkan setelah pekerjaan selesai</p>
        </form>
    );
};

export default WorkOrderForm;
