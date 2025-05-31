<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Halo Dunia!'
        ]);
    }

    public function about()
    {
        return response()->json([
            'message' => 'Ini adalah aplikasi restoran yang dibuat dengan Laravel dan React.'
        ]);
    }
}
