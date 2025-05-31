<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MenuController extends Controller
{
    /**
     * Display a listing of menus with their categories.
     */
    public function index()
    {
        $data = DB::table('menus')
            ->join('categories', 'categories.idkategori', '=', 'menus.idkategori')
            ->select('menus.*', 'categories.kategori as nama_kategori')
            ->orderBy('menus.menu', 'asc')
            ->get();

        return response()->json($data);
    }
}