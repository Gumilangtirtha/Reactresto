<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $primaryKey = 'id_order';
    
    protected $fillable = [
        'id_pelanggan',
        'tanggal_order',
        'total',
        'bayar',
        'kembali',
        'status'
    ];

    public function details()
    {
        return $this->hasMany(OrderDetail::class, 'id_order', 'id_order');
    }

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id');
    }
}
