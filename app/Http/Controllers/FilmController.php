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

    public function show(Request $request, int $id)
    {
        return Inertia::render('film/show', [
            'film' => null,
            'comments' => [],
            'sort' => 'newest',
            'genres' => [],
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('film.index');
    }

    public function edit(int $id)
    {
        return Inertia::render('film/edit', [
                'film' => null,
                'genres' => [],
        ]);
    }

    public function update(Request $request, int $id)
    {
        return redirect()->route('film.show', $id);
    }

    public function destroy(int $id)
    {
        return redirect()->route('film.index');
    }
}