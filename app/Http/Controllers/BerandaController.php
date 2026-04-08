<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\FilmView;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index(Request $request)
    {
        // Film Terpopuler ( berdasarkan tayangan minggu ini )
        $weekAgo = now()->startOfWeek();
        $popularFilmIds = FilmView::where('viewed_at', '>=', $weekAgo)
            ->select('film_id', DB::raw('COUNT(*) as view_count'))
            ->groupBy('film_id')
            ->orderByDesc('view_count')
            ->limit(6)
            ->pluck('film_id');

        $popularFilms = Film::withCount('ratings')
            ->whereIn('id', $popularFilmIds)
            ->get()
            ->map(function ($film) use ($weekAgo) {
                $weeklyViews = $film->views()->where('viewed_at', '>=', $weekAgo)->count();
                return [
                    'id' => $film->id,
                    'poster' => $film->poster,
                    'judul' => $film->judul,
                    'genre' => $film->genre,
                    'sinopsis' => $film->sinopsis,
                    'average_rating' => $film->average_rating,
                    'reviewer_count' => $film->reviewer_count,
                    'weekly_views' => $weeklyViews,
                    'total_views' => $film->views()->count(),
                ];
            })
            ->sortByDesc('weekly_views')
            ->values();

        // Film Terbaik ( berdasarkan rating )
        $bestFilms = Film::withCount('ratings')
            ->get()
            ->map(function ($film) {
                return [
                    'id' => $film->id,
                    'poster' => $film->poster,
                    'judul' => $film->judul,
                    'genre' => $film->genre,
                    'sinopsis' => $film->sinopsis,
                    'average_rating' => $film->average_rating,
                    'reviewer_count' => $film->reviewer_count,
                    'total_views' => $film->views()->count(),
                ];
            })
            ->filter(fn($f) => $f['reviewer_count'] > 0)
            ->sortByDesc('average_rating')
            ->take(6)
            ->values();

        // Stats
        $stats = [
            'total_films' => Film::count(),
            'total_reviewers' => User::count(),
            'total_ratings' => Rating::count(),
        ];

        $component = $request->is('beranda') ? 'beranda-index' : 'beranda';

        return Inertia::render($component, [
            'popularFilms' => $popularFilms,
            'bestFilms' => $bestFilms,
            'stats' => $stats,
        ]);
    }
}
