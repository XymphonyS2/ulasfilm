import { Head, Link, usePage } from '@inertiajs/react';
import { Film, TrendingUp, Award } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { FilmCard } from '@/components/film-card';
import { Button } from '@/components/ui/button';

export default function BerandaIndex() {
    const { auth, popularFilms = [], bestFilms = [], stats = {} } = usePage<{
        auth: { user: { name: string; role: string } | null };
        popularFilms: Array<{
            id: number;
            poster: string | null;
            judul: string;
            genre: string;
            sinopsis: string;
            average_rating: number | null;
            reviewer_count: number;
            weekly_views: number;
        }>;
        bestFilms: Array<{
            id: number;
            poster: string | null;
            judul: string;
            genre: string;
            sinopsis: string;
            average_rating: number | null;
            reviewer_count: number;
            total_views: number;
        }>;
        stats: { total_films: number; total_reviewers: number; total_ratings: number };
    }>().props;

    return (
        <>
            <Head title="ulas.film — Beranda" />
            <div className="min-h-screen bg-[#0D0D0D]">
                <Navbar />

                {/* Film Terpopuler */}
                {popularFilms.length > 0 && (
                    <section className="py-12 border-t border-[#1A1A1A]">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="size-5 text-[#F5C518]" />
                                    <h2 className="text-xl font-bold text-white">Film Terpopuler</h2>
                                    <span className="text-xs text-[#666666] bg-[#1A1A1A] border border-[#2D2D2D] px-2 py-0.5 rounded-full">7 Hari Terakhir</span>
                                </div>
                                <Button variant="ghost" asChild className="text-[#B3B3B3] hover:text-white text-sm">
                                    <Link href="/film">Lihat Semua</Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {popularFilms.map((film) => (
                                    <FilmCard key={film.id} film={film} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Film Terbaik */}
                {bestFilms.length > 0 && (
                    <section className="py-12 border-t border-[#1A1A1A]">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Award className="size-5 text-[#F5C518]" />
                                    <h2 className="text-xl font-bold text-white">Film Terbaik</h2>
                                    <span className="text-xs text-[#666666] bg-[#1A1A1A] border border-[#2D2D2D] px-2 py-0.5 rounded-full">Sepanjang Masa</span>
                                </div>
                                <Button variant="ghost" asChild className="text-[#B3B3B3] hover:text-white text-sm">
                                    <Link href="/film">Lihat Semua</Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {bestFilms.map((film) => (
                                    <FilmCard key={film.id} film={film} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-[#1A1A1A] py-8 mt-auto">
                    <div className="mx-auto max-w-7xl px-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Film className="size-4 text-[#F5C518]" />
                            <span className="text-sm font-bold">
                                <span className="text-[#F5C518]">ulas</span>
                                <span className="text-white">.film</span>
                            </span>
                        </div>
                        <p className="text-[#666666] text-xs">
                            &copy; {new Date().getFullYear()} ulas.film — Platform Review Film Indonesia
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

BerandaIndex.layout = null;
