<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('film/index', [
            'films' => [],
            'genres' => [],
            'filters' => [],
        ]);
    }
}
