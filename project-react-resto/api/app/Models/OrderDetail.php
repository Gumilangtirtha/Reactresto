<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'order_details';
    protected $primaryKey = 'id_order_detail';
    
    protected $fillable = [
        'id_order',
        'id_menu',
        'jumlah',
        'harga_jual'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'id_order', 'id_order');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'id_menu', 'id');
    }
}
