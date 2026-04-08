<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Film extends Model
{
    use HasFactory;

    protected $fillable = ['poster', 'judul', 'genre', 'sinopsis'];

    public function views(): HasMany
    {
        return $this->hasMany(FilmView::class);
    }

    public const GENRES = [
        'Aksi',
        'Komedi',
        'Drama',
        'Horor',
        'Romantis',
        'Thriller',
        'Fantasi',
        'Fiksi Ilmiah',
        'Petualangan',
        'Animasi',
        'Dokumenter',
    ];

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function getAverageRatingAttribute(): ?float
    {
        if ($this->ratings->isEmpty()) {
            return null;
        }

        return round($this->ratings->avg('score'), 1);
    }

    public function getReviewerCountAttribute(): int
    {
        return $this->ratings->count();
    }
}
