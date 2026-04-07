import { Head, Link, usePage } from '@inertiajs/react';
import { Film, Star, Users, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { FilmCard } from '@/components/film-card';
import { Button } from '@/components/ui/button';

export default function Beranda() {
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

                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 sm:py-28">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#111111] to-[#0D0D0D]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5C518]/5 rounded-full blur-[120px]" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#F5C518]/30 bg-[#F5C518]/10 px-4 py-1.5 mb-6">
                            <Film className="size-4 text-[#F5C518]" />
                            <span className="text-[#F5C518] text-sm font-medium">Platform Review Film Indonesia</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
                            <span className="text-white">Review Film.</span>
                            <br />
                            <span className="text-[#F5C518]">Ceritakan Pendapatmu.</span>
                        </h1>
                        <p className="text-[#B3B3B3] text-lg sm:text-xl max-w-2xl mx-auto mb-8">
                            Temukan film favorit, berikan rating, dan baca ulasan dari komunitas film Indonesia.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button asChild size="lg" className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold px-8">
                                <Link href="/film">Jelajahi Film<ChevronRight className="size-4 ml-1" /></Link>
                            </Button>
                            {!auth.user && (
                                <Button asChild variant="outline" size="lg" className="border-[#2D2D2D] text-[#B3B3B3] hover:text-white hover:border-[#3D3D3D] hover:bg-[#1A1A1A] px-8">
                                    <Link href="/register">Daftar Sekarang</Link>
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-16 max-w-xl mx-auto">
                            {[
                                { icon: Film, label: 'Film', value: stats.total_films?.toString() ?? '0' },
                                { icon: Users, label: 'Reviewer', value: stats.total_reviewers?.toString() ?? '0' },
                                { icon: Star, label: 'Rating', value: stats.total_ratings?.toString() ?? '0' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="text-center">
                                    <div className="inline-flex items-center justify-center size-10 rounded-full bg-[#1A1A1A] border border-[#2D2D2D] mb-2">
                                        <Icon className="size-5 text-[#F5C518]" />
                                    </div>
                                    <div className="text-xl font-bold text-white">{value}</div>
                                    <div className="text-xs text-[#666666]">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

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

                {/* CTA for guests */}
                {!auth.user && (
                    <section className="py-16 border-t border-[#1A1A1A]">
                        <div className="mx-auto max-w-3xl px-4 text-center">
                            <h2 className="text-2xl font-bold text-white mb-3">Bergabung dengan Komunitas</h2>
                            <p className="text-[#B3B3B3] mb-6">
                                Daftar sekarang untuk memberikan rating, menulis ulasan, dan berdiskusi tentang film favoritmu.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button asChild className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold">
                                    <Link href="/register">Daftar Gratis</Link>
                                </Button>
                                <Button asChild variant="outline" className="border-[#2D2D2D] text-[#B3B3B3] hover:text-white hover:bg-[#1A1A1A]">
                                    <Link href="/login">Masuk</Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-[#1A1A1A] py-8">
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

Beranda.layout = null;
