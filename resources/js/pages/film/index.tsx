import { Head, usePage } from '@inertiajs/react';
import { Film, Filter, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { FilmCard } from '@/components/film-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function FilmIndex() {
    const { films = [], genres = [], filters = {} } = usePage<{
        films: Array<{
            id: number;
            poster: string | null;
            judul: string;
            genre: string;
            sinopsis: string;
            average_rating: number | null;
            reviewer_count: number;
        }>;
        genres: string[];
        filters: { q?: string; genre?: string; rating?: string };
    }>().props;

    const [search, setSearch] = useState(filters.q ?? '');
    const [genre, setGenre] = useState(filters.genre ?? 'all');
    const [rating, setRating] = useState(filters.rating ?? 'all');

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (genre && genre !== 'all') params.set('genre', genre);
        if (rating && rating !== 'all') params.set('rating', rating);
        const query = params.toString();
        window.location.href = `/film${query ? `?${query}` : ''}`;
    };

    const clearFilters = () => {
        setSearch('');
        setGenre('all');
        setRating('all');
        window.location.href = '/film';
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') applyFilters();
    };

    return (
        <>
            <Head title="List Film — ulas.film" />
            <div className="min-h-screen bg-[#0D0D0D]">
                <Navbar />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex items-center justify-center size-10 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/30">
                            <Film className="size-5 text-[#F5C518]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">List Film</h1>
                            <p className="text-[#666666] text-sm">{films.length} film ditemukan</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] p-4 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="size-4 text-[#F5C518]" />
                            <span className="text-sm font-medium text-white">Filter</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#666666]" />
                                <Input
                                    placeholder="Cari judul film..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="pl-9 bg-[#242424] border-[#2D2D2D] text-white placeholder:text-[#666666] h-9"
                                />
                            </div>

                            {/* Genre */}
                            <Select value={genre} onValueChange={setGenre}>
                                <SelectTrigger className="bg-[#242424] border-[#2D2D2D] text-white h-9">
                                    <SelectValue placeholder="Genre" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white">
                                    <SelectItem value="all">Semua Genre</SelectItem>
                                    {genres.map((g) => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Rating */}
                            <Select value={rating} onValueChange={setRating}>
                                <SelectTrigger className="bg-[#242424] border-[#2D2D2D] text-white h-9">
                                    <SelectValue placeholder="Rating minimum" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white">
                                    <SelectItem value="all">Semua Rating</SelectItem>
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <SelectItem key={r} value={String(r)}>{r} Bintang+</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button
                                onClick={applyFilters}
                                size="sm"
                                className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold h-8"
                            >
                                Terapkan Filter
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                size="sm"
                                className="text-[#B3B3B3] hover:text-white h-8"
                            >
                                <X className="size-3 mr-1" /> Reset
                            </Button>
                        </div>
                    </div>

                    {/* Grid */}
                    {films.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {films.map((film) => (
                                <FilmCard key={film.id} film={film} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Film className="size-16 text-[#2D2D2D] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Film Tidak Ditemukan</h3>
                            <p className="text-[#666666] mb-4">Coba ubah filter pencarian Anda.</p>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="border-[#2D2D2D] text-[#B3B3B3] hover:text-white hover:bg-[#1A1A1A]"
                            >
                                Reset Filter
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
