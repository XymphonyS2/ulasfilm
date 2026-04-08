<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Genre yang tersedia di aplikasi.
     * Genre disimpan sebagai string di field `genre` pada tabel films.
     * Untuk menambahkan/mengubah genre, edit konstanta `Film::GENRES` di:
     * app/Models/Film.php
     */
    public function run(): void
    {
        $genres = [
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

        $this->command->info('Genre yang tersedia:');
        foreach ($genres as $i => $genre) {
            $this->command->line(sprintf('  %d. %s', $i + 1, $genre));
        }
        $this->command->info(sprintf('Total: %d genre', count($genres)));
    }
}
