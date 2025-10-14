import { WorkOrder } from '@/types/WorkOrder';
import { Datepicker, HelperText, Label, TextInput, Textarea } from 'flowbite-react';
import { CalendarDays, Phone, Printer, Ruler, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Required = () => <span className="text-[#C70036]">*</span>;

interface AdditionalEditFieldsProps {
    orderStatus: string | undefined;
    orderCost: Partial<number> | null | undefined;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors?: Record<string, string>;
}

const AdditionalEditFields: React.FC<AdditionalEditFieldsProps> = ({ orderStatus, orderCost, handleChange, errors = {} }) => {
    const [displayPrice, setDisplayPrice] = useState('');

    const formatIDR = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const digitsOnly = input.replace(/[^\d]/g, '');
        const numPrice = parseInt(digitsOnly) || 0;

        setDisplayPrice(formatIDR(numPrice));

        handleChange({
            ...e,
            target: {
                ...e.target,
                name: 'orderCost',
                value: numPrice.toString(),
            },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    useEffect(() => {
        if (orderCost) {
            setDisplayPrice(formatIDR(orderCost));
        }
    }, [orderCost]);

    if (!orderStatus) {
        return;
    }

    return (
        <>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="orderStatus">
                        Status <Required />
                    </Label>
                </div>
                <select
                    id="orderStatus"
                    name="orderStatus"
                    value={orderStatus}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    required
                >
                    <option value="PENDING">Tertunda</option>
                    <option value="IN_PROCESS">Dalam Proses</option>
                    <option value="FINISHED">Selesai</option>
                    <option value="PICKED_UP">Telah Diambil</option>
                </select>
                <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.order_status}</HelperText>
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="orderCost">
                        Biaya Pekerjaan <Required />
                    </Label>
                </div>
                <TextInput
                    id="orderCost"
                    name="orderCost"
                    disabled={orderStatus !== 'FINISHED' && orderStatus !== 'PICKED_UP'}
                    value={displayPrice}
                    onChange={handlePriceInput}
                    placeholder=""
                    color={errors.order_cost ? 'failure' : undefined}
                    addon="Rp"
                    required
                />
                <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.order_cost}</HelperText>
            </div>
        </>
    );
};

interface WorkOrderFormProps {
    initialData?: Partial<WorkOrder> | null;
    onSubmit: (data: Partial<WorkOrder>) => void;
    formMethod: string;
    errors?: Record<string, string>;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ initialData, onSubmit, formMethod, errors = {} }) => {
    const [formData, setFormData] = useState<Partial<WorkOrder>>({
        customerName: '',
        whatsappNumber: '',
        orderTitle: '',
        printingSize: '',
        printingMaterial: '',
        orderStatus: 'PENDING',
        orderCost: 0,
        orderDeadline: new Date().toISOString().split('T')[0],
        orderDescription: '',
    });

    const convertToStringDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (initialData) {
            const processedData = { ...initialData };

            if (processedData.orderDeadline) {
                const date = new Date(processedData.orderDeadline);
                processedData.orderDeadline = convertToStringDate(date);
            }

            setFormData(processedData);
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

        const dateString = convertToStringDate(date);

        setFormData((prev) => ({ ...prev, orderDeadline: dateString }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const submitData = { ...formData };

        if (submitData.orderDeadline) {
            submitData.orderDeadline =
                typeof submitData.orderDeadline === 'string' ? submitData.orderDeadline : convertToStringDate(submitData.orderDeadline);
        }

        onSubmit(submitData);
    };

    return (
        <form id="work-order-form" onSubmit={handleSubmit} className="my-3 flex flex-col gap-4" method={formMethod} autoComplete="off">
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
                    color={errors.customer_name ? 'failure' : undefined}
                    required
                />
                <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.customer_name}</HelperText>
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
                    color={errors.whatsapp_number ? 'failure' : undefined}
                    required
                />
                <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.whatsapp_number}</HelperText>
            </div>

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="orderTitle">
                        Judul Kerja <Required />
                    </Label>
                </div>
                <TextInput
                    id="orderTitle"
                    name="orderTitle"
                    value={formData.orderTitle}
                    onChange={handleChange}
                    placeholder="Isi judul order disini"
                    color={errors.order_title ? 'failure' : undefined}
                    required
                />
                <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.order_title}</HelperText>
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
                        color={errors.printing_size ? 'failure' : undefined}
                        required
                    />
                    <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.printing_size}</HelperText>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="printingMaterial">
                            Bahan Cetak <Required />
                        </Label>
                    </div>
                    <TextInput
                        id="printingMaterial"
                        name="printingMaterial"
                        value={formData.printingMaterial}
                        onChange={handleChange}
                        placeholder="(Contoh: HVS, Art Paper, Carton, dll.)"
                        icon={Printer}
                        color={errors.printing_material ? 'failure' : undefined}
                        required
                    />
                    <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.printing_material}</HelperText>
                </div>
            </div>

            {initialData?.orderStatus && (
                <AdditionalEditFields orderStatus={formData.orderStatus} orderCost={formData.orderCost} handleChange={handleChange} errors={errors} />
            )}

            <div>
                <div className="mb-2 block">
                    <Label htmlFor="orderDeadline">
                        Deadline <Required />
                    </Label>
                </div>
                <Datepicker
                    id="orderDeadline"
                    name="orderDeadline"
                    onChange={handleDateChange}
                    icon={CalendarDays}
                    value={new Date(formData.orderDeadline || new Date())}
                    language="id-ID"
                    labelTodayButton="Hari Ini"
                    labelClearButton="Bersihkan"
                    color={errors.order_deadline ? 'failure' : undefined}
                    required
                />
                <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.order_deadline}</HelperText>
            </div>

            <div>
                <div className="mb-2 flex justify-between">
                    <Label htmlFor="orderDescription">Deskripsi Tambahan</Label>
                    <span className="text-xs text-[#6A7282] dark:text-gray-400">Opsional</span>
                </div>
                <Textarea
                    id="orderDescription"
                    name="orderDescription"
                    value={formData.orderDescription || ''}
                    onChange={handleChange}
                    placeholder="Tulis deskripsi tambahan disini..."
                    rows={4}
                    color={errors.order_description ? 'failure' : undefined}
                />
                <HelperText className="mb-2 text-xs font-light text-red-800 dark:text-red-400">{errors.order_description}</HelperText>
            </div>
            {!initialData?.orderStatus && (
                <p className="text-sm font-medium text-[#4A5565] dark:text-gray-400">Harga dapat dimasukkan setelah pekerjaan selesai</p>
            )}
        </form>
    );
};

export default WorkOrderForm;
