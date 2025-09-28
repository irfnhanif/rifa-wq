<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|min:2|max:255',
            'whatsapp_number' => 'required|string|regex:/^[0-9]{8,20}$/',
            'order_title' => 'required|string|min:2|max:255',
            'order_description' => 'nullable|string|min:2',
            'printing_size' => 'required|max:10',
            'printing_material' => 'required|string|min:2|max:255',
            'order_deadline' => 'required|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Nama pelanggan harus diisi.',
            'customer_name.min' => 'Nama pelanggan minimal 2 karakter.',
            'customer_name.max' => 'Nama pelanggan maksimal 255 karakter.',
            'whatsapp_number.required' => 'Nomor WhatsApp harus diisi.',
            'whatsapp_number.regex' => 'Format nomor WhatsApp tidak valid.',
            'order_title.required' => 'Judul pesanan harus diisi.',
            'order_title.min' => 'Judul pesanan minimal 2 karakter.',
            'order_description.min' => 'Deskripsi minimal 2 karakter.',
            'printing_size.required' => 'Ukuran cetak harus diisi.',
            'printing_material.required' => 'Bahan cetak harus diisi.',
            'printing_material.min' => 'Bahan cetak minimal 2 karakter.',
            'order_deadline.required' => 'Deadline pekerjaan harus diisi.',
            'order_deadline.date' => 'Deadline pekerjaan harus berupa tanggal yang valid.',
            'order_deadline.after_or_equal' => 'Deadline harus diatur hari ini atau selanjutnya.',
        ];
    }

    public function attributes(): array
    {
        return [
            'customer_name' => 'nama pelanggan',
            'whatsapp_number' => 'nomor WhatsApp',
            'order_title' => 'judul pesanan',
            'order_description' => 'deskripsi pesanan',
            'printing_size' => 'ukuran cetak',
            'printing_material' => 'bahan cetak',
            'order_deadline' => 'deadline pekerjaan',
        ];
    }
}
