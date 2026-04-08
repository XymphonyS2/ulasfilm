import { Head, usePage, router } from '@inertiajs/react';
import { Film, Plus, Trash2, Edit, X, Check } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';

type FilmData = {
    id: number;
    poster: string | null;
    judul: string;
    genre: string;
    sinopsis: string;
    average_rating: number | null;
    reviewer_count: number;
    created_at: string;
};

export default function Dashboard() {
    const { auth, films = [], stats, genres = [] } = usePage<{
        auth: { user: { name: string; role: string } | null };
        films: FilmData[];
        stats: { total_films: number; total_ratings: number; total_comments: number };
        genres: string[];
    }>().props;

    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        poster: null as File | null,
        judul: '',
        genre: '',
        sinopsis: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAddFilm = (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        if (formData.poster) form.append('poster', formData.poster);
        form.append('judul', formData.judul);
        form.append('genre', formData.genre);
        form.append('sinopsis', formData.sinopsis);

        setProcessing(true);
        router.post('/film', form, {
            forceFormData: true,
            onSuccess: () => {
                setShowAdd(false);
                setFormData({ poster: null, judul: '', genre: '', sinopsis: '' });
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err as Record<string, string>);
                setProcessing(false);
            },
        });
    };

    const handleDeleteFilm = (id: number) => {
        router.delete(`/film/${id}`, {
            onSuccess: () => setShowDelete(null),
        });
    };

    const openAddDialog = () => {
        setFormData({ poster: null, judul: '', genre: '', sinopsis: '' });
        setErrors({});
        setShowAdd(true);
    };

    return (
        <>
            <Head title="Dashboard Admin — ulas.film" />
            <div className="min-h-screen bg-[#0D0D0D]">
                <Navbar />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/30">
                                <Film className="size-5 text-[#F5C518]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
                                <p className="text-[#666666] text-sm">Kelola data film</p>
                            </div>
                        </div>
                        <Button
                            onClick={openAddDialog}
                            className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold"
                        >
                            <Plus className="size-4 mr-1" /> Tambah Film
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Total Film', value: stats?.total_films ?? 0 },
                            { label: 'Total Rating', value: stats?.total_ratings ?? 0 },
                            { label: 'Total Komentar', value: stats?.total_comments ?? 0 },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] p-4 text-center">
                                <div className="text-2xl font-bold text-[#F5C518]">{value}</div>
                                <div className="text-xs text-[#666666] mt-1">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Films Table */}
                    <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#2D2D2D]">
                                        <th className="text-left text-[#666666] font-medium px-4 py-3">Poster</th>
                                        <th className="text-left text-[#666666] font-medium px-4 py-3">Judul</th>
                                        <th className="text-left text-[#666666] font-medium px-4 py-3">Genre</th>
                                        <th className="text-left text-[#666666] font-medium px-4 py-3 hidden sm:table-cell">Rating</th>
                                        <th className="text-right text-[#666666] font-medium px-4 py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {films.map((film) => (
                                        <tr key={film.id} className="border-b border-[#2D2D2D] last:border-0 hover:bg-[#242424]/50 transition-colors">
                                            <td className="px-4 py-3">
                                                {film.poster ? (
                                                    <img
                                                        src={`/storage/${film.poster}`}
                                                        alt={film.judul}
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-14 bg-[#242424] rounded flex items-center justify-center text-[#666666] text-xs">
                                                        N/A
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-white font-medium">{film.judul}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-[#B3B3B3]">{film.genre}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <span className="text-[#F5C518]">
                                                    {film.average_rating ? `${film.average_rating}` : '—'}
                                                </span>
                                                <span className="text-[#666666] text-xs ml-1">
                                                    ({film.reviewer_count})
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => window.location.href = `/film/${film.id}/edit`}
                                                        className="text-[#B3B3B3] hover:text-[#F5C518] hover:bg-[#F5C518]/10 h-8 px-2"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowDelete(film.id)}
                                                        className="text-[#E53935] hover:text-white hover:bg-[#E53935]/10 h-8 px-2"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {films.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center text-[#666666] py-12">
                                                Belum ada film. Tambahkan film pertama Anda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Add Film Dialog */}
                <Dialog open={showAdd} onOpenChange={setShowAdd}>
                    <DialogContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-white flex items-center gap-2">
                                <Plus className="size-5 text-[#F5C518]" />
                                Tambah Film Baru
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddFilm} className="space-y-4">
                            {/* Poster */}
                            <div>
                                <Label className="text-[#B3B3B3] text-sm mb-2 block">Poster Film</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        setFormData(prev => ({ ...prev, poster: file }));
                                    }}
                                    className="bg-[#242424] border-[#2D2D2D] text-white file:text-[#F5C518] file:border-0 cursor-pointer h-9"
                                />
                                {formData.poster && (
                                    <p className={`text-xs mt-1 ${formData.poster.size > 2 * 1024 * 1024 ? 'text-[#E53935]' : 'text-[#666666]'}`}>
                                        {formData.poster.name} ({(formData.poster.size / (1024 * 1024)).toFixed(2)} MB)
                                        {formData.poster.size > 2 * 1024 * 1024 && ' — Ukuran file terlalu besar! Maks 2MB.'}
                                    </p>
                                )}
                                {!formData.poster && (
                                    <p className="text-[#666666] text-xs mt-1">Format: JPG, PNG. Maks 2MB.</p>
                                )}
                                {errors.poster && <InputError message={errors.poster} />}
                            </div>

                            {/* Judul */}
                            <div>
                                <Label className="text-[#B3B3B3] text-sm mb-2 block">Judul Film *</Label>
                                <Input
                                    value={formData.judul}
                                    onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))}
                                    placeholder="Contoh: Avengers: Endgame"
                                    className="bg-[#242424] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                    required
                                />
                                {errors.judul && <InputError message={errors.judul} />}
                            </div>

                            {/* Genre */}
                            <div>
                                <Label className="text-[#B3B3B3] text-sm mb-2 block">Genre *</Label>
                                <Select value={formData.genre} onValueChange={(v) => setFormData(prev => ({ ...prev, genre: v }))}>
                                    <SelectTrigger className="bg-[#242424] border-[#2D2D2D] text-white">
                                        <SelectValue placeholder="Pilih genre" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white">
                                        {genres.map((g) => (
                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.genre && <InputError message={errors.genre} />}
                            </div>

                            {/* Sinopsis */}
                            <div>
                                <Label className="text-[#B3B3B3] text-sm mb-2 block">Sinopsis *</Label>
                                <Textarea
                                    value={formData.sinopsis}
                                    onChange={(e) => setFormData(prev => ({ ...prev, sinopsis: e.target.value }))}
                                    placeholder="Tulis sinopsis film..."
                                    rows={4}
                                    className="bg-[#242424] border-[#2D2D2D] text-white placeholder:text-[#666666] resize-none"
                                    required
                                />
                                {errors.sinopsis && <InputError message={errors.sinopsis} />}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowAdd(false)}
                                    className="text-[#B3B3B3] hover:text-white"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !formData.judul || !formData.genre || !formData.sinopsis}
                                    className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold"
                                >
                                    <Check className="size-4 mr-1" /> Simpan Film
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
                    <DialogContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-white">Hapus Film</DialogTitle>
                        </DialogHeader>
                        <p className="text-[#B3B3B3] text-sm">
                            Apakah Anda yakin ingin menghapus film ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <DialogFooter>
                            <Button
                                variant="ghost"
                                onClick={() => setShowDelete(null)}
                                className="text-[#B3B3B3] hover:text-white"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => showDelete !== null && handleDeleteFilm(showDelete)}
                                className="bg-[#E53935] hover:bg-[#C62828]"
                            >
                                <Trash2 className="size-4 mr-1" /> Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
