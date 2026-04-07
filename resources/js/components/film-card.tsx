import { Link } from '@inertiajs/react';
import { Star, Eye } from 'lucide-react';

type Film = {
    id: number;
    poster: string | null;
    judul: string;
    genre: string;
    sinopsis: string;
    average_rating: number | null;
    reviewer_count: number;
    weekly_views?: number;
    total_views?: number;
};

export function FilmCard({ film }: { film: Film }) {
    const posterUrl = film.poster
        ? `/storage/${film.poster}`
        : `https://placehold.co/300x450/1A1A1A/F5C518?text=${encodeURIComponent(film.judul)}&font=roboto`;

    return (
        <div className="group relative rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2D2D2D] transition-all duration-300 hover:border-[#F5C518]/50 hover:shadow-[0_0_20px_rgba(245,197,24,0.15)]">
            {/* Poster */}
            <Link href={`/film/${film.id}`} className="block">
                <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                        src={posterUrl}
                        alt={film.judul}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Hover Overlay with Sinopsis */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white text-xs leading-relaxed line-clamp-4">
                            {film.sinopsis}
                        </p>
                        <div className="mt-2 flex items-center gap-1">
                            <Eye className="size-3 text-[#F5C518]" />
                            {film.weekly_views !== undefined ? (
                                <span className="text-[#F5C518] text-xs">{film.weekly_views} tayangan/minggu</span>
                            ) : film.total_views !== undefined ? (
                                <span className="text-[#F5C518] text-xs">{film.total_views} total tayangan</span>
                            ) : null}
                        </div>
                    </div>

                    {/* Genre badge */}
                    <div className="absolute top-2 left-2">
                        <span className="text-xs font-medium bg-[#F5C518] text-[#0D0D0D] px-2 py-0.5 rounded-full">
                            {film.genre}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-semibold text-white text-sm truncate mb-1 leading-tight">{film.judul}</h3>
                <div className="flex items-center gap-1">
                    <Star className="size-3 fill-[#F5C518] text-[#F5C518]" />
                    <span className="text-xs font-semibold text-white">
                        {film.average_rating ? film.average_rating.toFixed(1) : '-'}
                    </span>
                    <span className="text-[#666666] text-xs">({film.reviewer_count} reviewer)</span>
                </div>
            </div>
        </div>
    );
}

export function FilmCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2D2D2D]">
            <div className="aspect-[2/3] bg-[#242424] animate-pulse" />
            <div className="p-3 space-y-2">
                <div className="h-4 bg-[#242424] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#242424] rounded animate-pulse w-1/2" />
                <div className="h-3 bg-[#242424] rounded animate-pulse w-full" />
            </div>
        </div>
    );
}
