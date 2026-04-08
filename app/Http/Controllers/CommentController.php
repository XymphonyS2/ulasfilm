<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Film;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    private array $badWords = [
        'bodoh', 'bego', 'goblok', 'stupid', 'idiot', 'anjing', 'babi',
        'kampret', 'kontol', 'memek', 'ngentot', 'jancok', 'j enzyme',
        'sara', 'radikal', 'teroris',
    ];

    public function store(Request $request, int $filmId)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $content = trim($validated['content']);

        if (empty($content)) {
            return back()->withErrors(['content' => 'Komentar tidak boleh kosong.']);
        }

        if ($this->containsBadWords($content)) {
            return back()->withErrors(['content' => 'Komentar mengandung kata yang tidak diizinkan.']);
        }

        Film::findOrFail($filmId);

        Comment::create([
            'user_id' => Auth::id(),
            'film_id' => $filmId,
            'content' => $content,
        ]);

        return back()->with('success', 'Komentar berhasil dikirim.');
    }

    public function update(Request $request, int $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $content = trim($validated['content']);

        if (empty($content)) {
            return back()->withErrors(['content' => 'Komentar tidak boleh kosong.']);
        }

        if ($this->containsBadWords($content)) {
            return back()->withErrors(['content' => 'Komentar mengandung kata yang tidak diizinkan.']);
        }

        $comment->update(['content' => $content]);

        return back()->with('success', 'Komentar berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            abort(403);
        }

        $comment->delete();

        return back()->with('success', 'Komentar berhasil dihapus.');
    }

    private function containsBadWords(string $text): bool
    {
        $lower = strtolower($text);
        foreach ($this->badWords as $word) {
            if (str_contains($lower, $word)) {
                return true;
            }
        }
        return false;
    }
}
