<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentReaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentReactionController extends Controller
{
    public function store(Request $request, int $commentId, string $type)
    {
        $comment = Comment::findOrFail($commentId);

        if ($comment->user_id === Auth::id()) {
            return back()->withErrors(['reaction' => 'Anda tidak dapat menyukai komentar milik sendiri.']);
        }

        if (! in_array($type, ['like', 'dislike'])) {
            abort(400);
        }

        if ($request->get('_remove') === 'true') {
            CommentReaction::where('user_id', Auth::id())
                ->where('comment_id', $comment->id)
                ->delete();
            return back()->with('success', 'Reaksi berhasil dihapus.');
        } else {
            CommentReaction::updateOrCreate(
                ['user_id' => Auth::id(), 'comment_id' => $comment->id],
                ['type' => $type]
            );
            return back()->with('success', $type === 'like' ? 'Menyukai komentar.' : 'Tidak menyukai komentar.');
        }
    }
}
