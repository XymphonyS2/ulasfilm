<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Film;
use App\Models\FilmView;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        $query = Film::withCount('ratings')->with('ratings');

        if ($request->filled('q')) {
            $query->where('judul', 'like', '%' . $request->q . '%');
        }

        if ($request->filled('genre')) {
            $query->where('genre', $request->genre);
        }

        if ($request->filled('rating')) {
            $rating = (int) $request->rating;
            $query->get()->each; // load first
            // Filter by average rating after loading
        }

        $films = $query->get()->map(function ($film) {
            return [
                'id' => $film->id,
                'poster' => $film->poster,
                'judul' => $film->judul,
                'genre' => $film->genre,
                'sinopsis' => $film->sinopsis,
                'average_rating' => $film->average_rating,
                'reviewer_count' => $film->reviewer_count,
            ];
        });

        // Apply rating filter in memory if needed
        if ($request->filled('rating')) {
            $rating = (int) $request->rating;
            $films = $films->filter(fn($f) => $f['average_rating'] && $f['average_rating'] >= $rating);
        }

        return Inertia::render('film/index', [
            'films' => $films->values(),
            'genres' => Film::GENRES,
            'filters' => $request->only(['q', 'genre', 'rating']),
        ]);
    }

    public function show(Request $request, int $id)
    {
        $film = Film::with(['ratings', 'comments' => function ($q) {
            $q->with(['user', 'reactions']);
        }])->findOrFail($id);

        // Record view only on first visit (not on subsequent Inertia/POST-back visits)
        $viewKey = "film_viewed_{$film->id}_" . ($request->user() ? $request->user()->id : $request->ip());
        if (!session()->has($viewKey)) {
            FilmView::create([
                'film_id' => $film->id,
                'user_id' => Auth::id(),
                'ip_address' => $request->ip(),
                'viewed_at' => now(),
            ]);
            session()->put($viewKey, true);
        }

        $comments = $film->comments;

        if ($request->get('sort') === 'popular') {
            $comments = $comments->sortByDesc(fn($c) => $c->likes_count)->values();
        } else {
            $comments = $comments->sortByDesc('created_at')->values();
        }

        $userRating = null;
        if (Auth::check()) {
            $userRating = $film->ratings->firstWhere('user_id', Auth::id())?->score;
        }

        $comments = $comments->map(function ($comment) use ($film) {
            $userReaction = null;
            if (Auth::check()) {
                $reaction = $comment->reactions->firstWhere('user_id', Auth::id());
                $userReaction = $reaction?->type;
            }
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->toIso8601String(),
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                ],
                'likes_count' => $comment->likes_count,
                'dislikes_count' => $comment->dislikes_count,
                'user_reaction' => $userReaction,
                'is_owner' => Auth::check() && $comment->user_id === Auth::id(),
                'film_id' => $film->id,
            ];
        });

        return Inertia::render('film/show', [
            'film' => [
                'id' => $film->id,
                'poster' => $film->poster,
                'judul' => $film->judul,
                'genre' => $film->genre,
                'sinopsis' => $film->sinopsis,
                'average_rating' => $film->average_rating,
                'reviewer_count' => $film->reviewer_count,
                'user_rating' => $userRating,
            ],
            'comments' => $comments,
            'sort' => $request->get('sort', 'newest'),
            'genres' => Film::GENRES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'poster' => [
                'nullable',
                'image',
                'max:2048',
                'mimes:jpeg,jpg,png,webp,gif',
            ],
            'judul' => 'required|string|max:255',
            'genre' => ['required', Rule::in(Film::GENRES)],
            'sinopsis' => 'required|string|max:2000',
        ], [
            'poster.image' => 'File poster harus berupa gambar (JPG, PNG, WEBP, GIF).',
            'poster.max' => 'Ukuran poster maksimal 2MB.',
            'poster.mimes' => 'Format poster harus JPG, PNG, WEBP, atau GIF.',
        ]);

        $posterPath = null;
        if ($request->hasFile('poster')) {
            $posterPath = $request->file('poster')->store('posters', 'public');
        }

        Film::create([
            'poster' => $posterPath,
            'judul' => $validated['judul'],
            'genre' => $validated['genre'],
            'sinopsis' => $validated['sinopsis'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Film berhasil ditambahkan.');
    }

    public function edit(int $id)
    {
        $film = Film::findOrFail($id);

        return Inertia::render('film/edit', [
            'film' => [
                'id' => $film->id,
                'poster' => $film->poster,
                'judul' => $film->judul,
                'genre' => $film->genre,
                'sinopsis' => $film->sinopsis,
            ],
            'genres' => Film::GENRES,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $film = Film::findOrFail($id);

        $validated = $request->validate([
            'poster' => [
                'nullable',
                'image',
                'max:2048',
                'mimes:jpeg,jpg,png,webp,gif',
            ],
            'judul' => 'required|string|max:255',
            'genre' => ['required', Rule::in(Film::GENRES)],
            'sinopsis' => 'required|string|max:2000',
        ], [
            'poster.image' => 'File poster harus berupa gambar (JPG, PNG, WEBP, GIF).',
            'poster.max' => 'Ukuran poster maksimal 2MB.',
            'poster.mimes' => 'Format poster harus JPG, PNG, WEBP, atau GIF.',
        ]);

        $posterPath = $film->poster;
        if ($request->hasFile('poster')) {
            if ($film->poster) {
                Storage::disk('public')->delete($film->poster);
            }
            $posterPath = $request->file('poster')->store('posters', 'public');
        }

        $film->update([
            'poster' => $posterPath,
            'judul' => $validated['judul'],
            'genre' => $validated['genre'],
            'sinopsis' => $validated['sinopsis'],
        ]);

        return redirect()->route('film.show', $film->id)->with('success', 'Film berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $film = Film::findOrFail($id);

        if ($film->poster) {
            Storage::disk('public')->delete($film->poster);
        }

        $film->delete();

        return redirect()->route('dashboard')->with('success', 'Film berhasil dihapus.');
    }
}
