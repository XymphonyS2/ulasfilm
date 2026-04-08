import { Head, usePage, router } from '@inertiajs/react';
import { Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { RatingStars, RatingDisplay } from '@/components/rating-stars';
import { CommentItem } from '@/components/comment-item';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function FilmShow() {
    const { auth, film: initialFilm, comments: initialComments = [], sort = 'newest' } = usePage<{
        auth: { user: { name: string; role: string } | null };
        film: {
            id: number;
            poster: string | null;
            judul: string;
            genre: string;
            sinopsis: string;
            average_rating: number | null;
            reviewer_count: number;
            user_rating: number | null;
        };
        comments: Array<{
            id: number;
            content: string;
            created_at: string;
            user: { id: number; name: string };
            likes_count: number;
            dislikes_count: number;
            user_reaction: string | null;
            is_owner: boolean;
        }>;
        sort: string;
    }>().props;

    const [film, setFilm] = useState(initialFilm);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const posterUrl = film.poster
        ? `/storage/${film.poster}`
        : `https://placehold.co/400x600/1A1A1A/F5C518?text=${encodeURIComponent(film.judul)}&font=roboto`;

    const handleRating = (score: number) => {
        if (!auth.user) {
            setCommentError('Silakan masuk terlebih dahulu untuk memberikan rating.');
            return;
        }
        router.post(`/film/${film.id}/rating`, { score }, {
            preserveScroll: true,
            onSuccess: () => {
                // Recalculate average from current ratings + new score
                const newReviewerCount = film.user_rating ? film.reviewer_count : film.reviewer_count + 1;
                const oldTotal = (film.average_rating ?? 0) * film.reviewer_count;
                const newTotal = film.user_rating
                    ? oldTotal - film.user_rating + score
                    : oldTotal + score;
                const newAvg = newTotal / newReviewerCount;
                setFilm(prev => ({
                    ...prev,
                    average_rating: Math.round(newAvg * 10) / 10,
                    reviewer_count: newReviewerCount,
                    user_rating: score,
                }));
            },
        });
    };

    const handleSort = (value: string) => {
        router.get(`/film/${film.id}`, { sort: value }, { preserveScroll: true });
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) {
            setCommentError('Komentar tidak boleh kosong.');
            return;
        }
        setCommentError('');
        setSubmitting(true);

        router.post(`/film/${film.id}/comment`, { content: commentText }, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                setCommentText('');
            },
            onError: (errors: any) => {
                setSubmitting(false);
                if (errors.content) setCommentError(errors.content);
            },
        });
    };

    return (
        <>
            <Head title={`${film.judul} — ulas.film`} />
            <div className="min-h-screen bg-[#0D0D0D]">
                <Navbar />

                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* Film Header */}
                    <div className="flex flex-col sm:flex-row gap-8 mb-10">
                        {/* Poster */}
                        <div className="shrink-0">
                            <div className="w-48 sm:w-56 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2D2D2D] shadow-2xl">
                                <img
                                    src={posterUrl}
                                    alt={film.judul}
                                    className="w-full aspect-[2/3] object-cover"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{film.judul}</h1>
                                    <span className="inline-block text-xs font-medium bg-[#F5C518] text-[#0D0D0D] px-3 py-1 rounded-full">
                                        {film.genre}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <RatingDisplay value={film.average_rating} count={film.reviewer_count} />
                            </div>

                            <p className="text-[#B3B3B3] leading-relaxed mb-8">{film.sinopsis}</p>

                            {/* Rating Section */}
                            <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Star className="size-4 text-[#F5C518]" />
                                    <span className="text-sm font-medium text-white">Berikan Rating</span>
                                </div>
                                {auth.user ? (
                                    <>
                                        <RatingStars
                                            value={film.user_rating}
                                            onChange={handleRating}
                                            size="lg"
                                        />
                                        {film.user_rating && (
                                            <p className="text-[#666666] text-xs mt-2">
                                                Rating Anda: {film.user_rating} bintang
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-[#666666] text-sm">
                                        <a href="/login" className="text-[#F5C518] hover:underline">
                                            Masuk
                                        </a>{' '}
                                        atau{' '}
                                        <a href="/register" className="text-[#F5C518] hover:underline">
                                            Daftar
                                        </a>{' '}
                                        untuk memberikan rating.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-[#2D2D2D] mb-8" />

                    {/* Comments Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="size-5 text-[#F5C518]" />
                                <h2 className="text-xl font-bold text-white">
                                    Komentar ({initialComments.length})
                                </h2>
                            </div>

                            <Select value={sort} onValueChange={handleSort}>
                                <SelectTrigger className="bg-[#1A1A1A] border-[#2D2D2D] text-white h-9 w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white">
                                    <SelectItem value="newest">Terbaru</SelectItem>
                                    <SelectItem value="popular">Terpopuler</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Comment Form */}
                        {auth.user ? (
                            <form onSubmit={handleSubmitComment} className="mb-8">
                                <Label htmlFor="comment" className="text-[#B3B3B3] text-sm mb-2 block">
                                    Tulis Komentar
                                </Label>
                                <Textarea
                                    id="comment"
                                    value={commentText}
                                    onChange={(e) => { setCommentText(e.target.value); setCommentError(''); }}
                                    placeholder="Apa pendapatmu tentang film ini?"
                                    rows={4}
                                    className="bg-[#1A1A1A] border-[#2D2D2D] text-white placeholder:text-[#666666] mb-2 resize-none"
                                />
                                {commentError && <p className="text-red-500 text-sm mb-2">{commentError}</p>}
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold"
                                >
                                    {submitting ? 'Mengirim...' : 'Kirim Komentar'}
                                </Button>
                            </form>
                        ) : (
                            <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] p-5 mb-8 text-center">
                                <p className="text-[#B3B3B3] mb-3">
                                    Silakan{' '}
                                    <a href="/login" className="text-[#F5C518] hover:underline font-medium">
                                        masuk
                                    </a>{' '}
                                    atau{' '}
                                    <a href="/register" className="text-[#F5C518] hover:underline font-medium">
                                        daftar
                                    </a>{' '}
                                    untuk menulis komentar.
                                </p>
                            </div>
                        )}

                        {/* Comments List */}
                        {initialComments.length > 0 ? (
                            <div className="space-y-3">
                                {initialComments.map((comment) => (
                                    <CommentItem key={comment.id} comment={comment} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <MessageSquare className="size-12 text-[#2D2D2D] mx-auto mb-3" />
                                <p className="text-[#666666]">Belum ada komentar. Jadilah yang pertama!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
