import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';

export default function FilmEdit() {
    const { film, genres = [] } = usePage<{
        film: {
            id: number;
            poster: string | null;
            judul: string;
            genre: string;
            sinopsis: string;
        };
        genres: string[];
    }>().props;

    const { data, setData, processing, errors, post } = useForm({
        _method: 'put',
        poster: null as File | null,
        judul: film.judul,
        genre: film.genre,
        sinopsis: film.sinopsis,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/film/${film.id}`, {
            forceFormData: true,
        });
    };

    const posterUrl = film.poster
        ? `/storage/${film.poster}`
        : `https://placehold.co/300x450/1A1A1A/F5C518?text=${encodeURIComponent(film.judul)}&font=roboto`;

    return (
        <>
            <Head title={`Edit ${film.judul} — ulas.film`} />
            <div className="min-h-screen bg-[#0D0D0D]">
                <Navbar />

                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <Link
                            href={`/film/${film.id}`}
                            className="flex items-center justify-center size-9 rounded-full bg-[#1A1A1A] border border-[#2D2D2D] text-[#B3B3B3] hover:text-white hover:border-[#F5C518] transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Edit Film</h1>
                            <p className="text-[#666666] text-sm">{film.judul}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Poster Preview */}
                        <div className="flex items-start gap-4">
                            <div className="shrink-0">
                                <img
                                    src={posterUrl}
                                    alt={film.judul}
                                    className="w-32 h-48 object-cover rounded-xl bg-[#1A1A1A] border border-[#2D2D2D]"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="poster" className="text-[#B3B3B3] text-sm mb-2 block">
                                    Poster (opsional)
                                </Label>
                                <Input
                                    id="poster"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('poster', e.target.files?.[0] ?? null)}
                                    className="bg-[#1A1A1A] border-[#2D2D2D] text-white file:text-[#F5C518] file:border-0 file:mr-3 file:font-semibold cursor-pointer"
                                />
                                <InputError message={errors.poster} className="mt-2" />
                                <p className="text-[#666666] text-xs mt-2">Format: JPG, PNG, WEBP. Maks: 2MB.</p>
                            </div>
                        </div>

                        {/* Judul */}
                        <div className="space-y-2">
                            <Label htmlFor="judul" className="text-[#B3B3B3] text-sm">
                                Judul Film
                            </Label>
                            <Input
                                id="judul"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                className="bg-[#1A1A1A] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                placeholder="Masukkan judul film"
                                required
                            />
                            <InputError message={errors.judul} className="mt-2" />
                        </div>

                        {/* Genre */}
                        <div className="space-y-2">
                            <Label htmlFor="genre" className="text-[#B3B3B3] text-sm">
                                Genre
                            </Label>
                            <Select value={data.genre} onValueChange={(v) => setData('genre', v)}>
                                <SelectTrigger className="bg-[#1A1A1A] border-[#2D2D2D] text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white">
                                    {genres.map((g) => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.genre} className="mt-2" />
                        </div>

                        {/* Synopsis */}
                        <div className="space-y-2">
                            <Label htmlFor="sinopsis" className="text-[#B3B3B3] text-sm">
                                Sinopsis / Deskripsi
                            </Label>
                            <Textarea
                                id="sinopsis"
                                value={data.sinopsis}
                                onChange={(e) => setData('sinopsis', e.target.value)}
                                rows={5}
                                className="bg-[#1A1A1A] border-[#2D2D2D] text-white placeholder:text-[#666666] resize-none"
                                placeholder="Masukkan sinopsis film"
                                required
                            />
                            <InputError message={errors.sinopsis} className="mt-2" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold"
                            >
                                <Pencil className="size-4 mr-2" />
                                Simpan Perubahan
                            </Button>
                            <Link href={`/film/${film.id}`}>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-[#B3B3B3] hover:text-white hover:bg-[#1A1A1A]"
                                >
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
