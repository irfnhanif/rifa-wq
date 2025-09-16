<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkOrder extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'customer_name',
        'whatsapp_number',
        'order_title',
        'order_description',
        'printing_size',
        'printing_material',
        'order_deadline',
        'order_status',
        'order_cost'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
