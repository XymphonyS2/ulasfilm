<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $films = Film::withCount('ratings')->with('ratings')->get()->map(function ($film) {
            return [
                'id' => $film->id,
                'poster' => $film->poster,
                'judul' => $film->judul,
                'genre' => $film->genre,
                'sinopsis' => $film->sinopsis,
                'average_rating' => $film->average_rating,
                'reviewer_count' => $film->reviewer_count,
                'created_at' => $film->created_at->toIso8601String(),
            ];
        });

        $stats = [
            'total_films' => Film::count(),
            'total_ratings' => DB::table('ratings')->count(),
            'total_comments' => DB::table('comments')->count(),
        ];

        return Inertia::render('dashboard/index', [
            'films' => $films,
            'stats' => $stats,
            'genres' => Film::GENRES,
        ]);
    }
}
