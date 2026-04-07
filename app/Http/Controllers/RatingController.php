<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function store(Request $request, int $filmId)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:1|max:5',
        ]);

        $film = Film::findOrFail($filmId);

        Rating::updateOrCreate(
            ['user_id' => Auth::id(), 'film_id' => $film->id],
            ['score' => $validated['score']]
        );

        return back()->with('success', 'Rating berhasil disimpan.');
    }
}
