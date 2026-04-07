<?php

use App\Http\Controllers\BerandaController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentReactionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FilmController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BerandaController::class, 'index'])->name('home');
Route::get('/beranda', [BerandaController::class, 'index'])->name('beranda');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('role:admin');
    Route::get('/profile', [UserProfileController::class, 'index'])->name('profile.index');
    Route::patch('/profile', [UserProfileController::class, 'updateName'])->name('user.profile.update');
});

require __DIR__.'/settings.php';

// Film routes
Route::get('/film', [FilmController::class, 'index'])->name('film.index');
Route::get('/film/{id}', [FilmController::class, 'show'])->name('film.show');

// Authenticated actions
Route::middleware(['auth'])->group(function () {
    Route::post('/film', [FilmController::class, 'store'])->name('film.store')->middleware('role:admin');
    Route::get('/film/{id}/edit', [FilmController::class, 'edit'])->name('film.edit')->middleware('role:admin');
    Route::put('/film/{id}', [FilmController::class, 'update'])->name('film.update')->middleware('role:admin');
    Route::delete('/film/{id}', [FilmController::class, 'destroy'])->name('film.destroy')->middleware('role:admin');
    Route::post('/film/{filmId}/rating', [RatingController::class, 'store'])->name('rating.store');
    Route::post('/film/{filmId}/comment', [CommentController::class, 'store'])->name('comment.store');
    Route::put('/comment/{id}', [CommentController::class, 'update'])->name('comment.update');
    Route::delete('/comment/{id}', [CommentController::class, 'destroy'])->name('comment.destroy');
    Route::post('/comment/{commentId}/reaction/{type}', [CommentReactionController::class, 'store'])->name('comment.reaction');
});
