<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;

Route::put('/users/{id}/status', [LoginController::class, 'updateStatus']);