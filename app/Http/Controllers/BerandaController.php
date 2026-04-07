<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index(Request $request)
    {
        $component = $request->is('beranda') ? 'beranda-index' : 'beranda';

        return Inertia::render($component, [
            'popularFilms' => [],
            'bestFilms' => [],
            'stats' => [
                'total_films' => 0,
                'total_reviewers' => 0,
                'total_ratings' => 0,
            ],
        ]);
    }
}
