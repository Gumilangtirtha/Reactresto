<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id('id_detail');
            $table->foreignId('xo_id')->constrained('orders', 'id_order');
            $table->foreignId('id_menu')->constrained('menus', 'id_menu');
            $table->integer('jumlah');
            $table->decimal('harga_jual', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_details');
    }
}
