<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index(Request $request)
    {

        $totalFilms = 0;
        $totalReviewers = User::count();
        $totalRatings = 0;
        $popularFilms = [];
        $bestFilms = [];

        $component = $request->is('beranda') ? 'beranda-index' : 'beranda';

        return Inertia::render($component, [
            'popularFilms' => $popularFilms,
            'bestFilms' => $bestFilms,
            'stats' => [
                'total_films' => $totalFilms,
                'total_reviewers' => $totalReviewers,
                'total_ratings' => $totalRatings,
            ],
        ]);
    }
}
