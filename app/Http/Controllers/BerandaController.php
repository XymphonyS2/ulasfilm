<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Film;
use App\Models\FilmView;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index(Request $request)
    {
        $weekAgo = now()->subWeek();

        // Stats for Hero Section
        $totalFilms = Film::count();
        $totalReviewers = User::count();
        $totalRatings = Rating::count();

        // Film Terpopuler: berdasarkan jumlah tayangan 7 hari terakhir
        $popularFilmIds = FilmView::where('viewed_at', '>=', $weekAgo)
            ->selectRaw('film_id, COUNT(*) as view_count')
            ->groupBy('film_id')
            ->orderByDesc('view_count')
            ->limit(6)
            ->pluck('film_id')
            ->toArray();

        $popularFilms = [];
        if (count($popularFilmIds) > 0) {
            $films = Film::withCount(['ratings', 'views as weekly_views_count' => function ($q) use ($weekAgo) {
                $q->where('viewed_at', '>=', $weekAgo);
            }])
                ->with('ratings')
                ->whereIn('id', $popularFilmIds)
                ->get()
                ->sortByDesc('weekly_views_count')
                ->values();

            $popularFilms = $films->map(fn($film) => [
                'id' => $film->id,
                'poster' => $film->poster,
                'judul' => $film->judul,
                'genre' => $film->genre,
                'sinopsis' => $film->sinopsis,
                'average_rating' => $film->ratings->avg('score') ? round($film->ratings->avg('score'), 1) : null,
                'reviewer_count' => $film->ratings_count,
                'weekly_views' => $film->weekly_views_count,
            ])->toArray();
        }

        // Film Terbaik: berdasarkan rating tertinggi (minimal 2 reviewer)
        $allFilms = Film::withCount(['ratings', 'views'])
            ->with('ratings')
            ->get()
            ->map(fn($film) => [
                'avg' => $film->ratings->avg('score') ?? 0,
                'film' => $film,
            ])
            ->filter(fn($item) => $item['film']->ratings_count >= 2)
            ->sortByDesc('avg')
            ->take(6)
            ->values();

        $bestFilms = $allFilms->map(fn($item) => [
            'id' => $item['film']->id,
            'poster' => $item['film']->poster,
            'judul' => $item['film']->judul,
            'genre' => $item['film']->genre,
            'sinopsis' => $item['film']->sinopsis,
            'average_rating' => $item['avg'] > 0 ? round($item['avg'], 1) : null,
            'reviewer_count' => $item['film']->ratings_count,
            'total_views' => $item['film']->views_count,
        ])->toArray();

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
