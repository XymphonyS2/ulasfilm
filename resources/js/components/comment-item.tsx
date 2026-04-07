import { usePage, router } from '@inertiajs/react';
import { ThumbsUp, ThumbsDown, Edit2, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

type Comment = {
    id: number;
    content: string;
    created_at: string;
    user: { id: number; name: string };
    likes_count: number;
    dislikes_count: number;
    user_reaction: string | null;
    is_owner: boolean;
    film_id?: number;
};

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function CommentItem({ comment }: { comment: Comment }) {
    const { auth } = usePage().props as any;
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [localContent, setLocalContent] = useState(comment.content);
    const [showDelete, setShowDelete] = useState(false);
    const [localLikes, setLocalLikes] = useState(comment.likes_count);
    const [localDislikes, setLocalDislikes] = useState(comment.dislikes_count);
    const [localReaction, setLocalReaction] = useState(comment.user_reaction);
    const [likeAnimating, setLikeAnimating] = useState(false);
    const [dislikeAnimating, setDislikeAnimating] = useState(false);
    const filmId = comment.film_id || (usePage().props as any).film?.id;

    const handleReaction = (type: 'like' | 'dislike') => {
        if (!auth.user) {
            alert('Silakan masuk terlebih dahulu untuk memberikan reaksi.');
            return;
        }

        const isCurrentReaction = localReaction === type;

        if (isCurrentReaction) {
            if (type === 'like') setLocalLikes(prev => prev - 1);
            else setLocalDislikes(prev => prev - 1);
            setLocalReaction(null);
        } else {
            if (type === 'like') {
                setLocalLikes(prev => prev + 1);
                if (localReaction === 'dislike') setLocalDislikes(prev => prev - 1);
                setLocalReaction('like');
                setLikeAnimating(true);
                setTimeout(() => setLikeAnimating(false), 400);
            } else {
                setLocalDislikes(prev => prev + 1);
                if (localReaction === 'like') setLocalLikes(prev => prev - 1);
                setLocalReaction('dislike');
                setDislikeAnimating(true);
                setTimeout(() => setDislikeAnimating(false), 400);
            }
        }

        router.post(
            `/comment/${comment.id}/reaction/${type}`,
            { _remove: isCurrentReaction ? 'true' : 'false' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (filmId) {
                        router.get(`/film/${filmId}`, {}, { only: ['comments'], preserveScroll: true });
                    }
                },
                onError: () => {
                    setLocalLikes(comment.likes_count);
                    setLocalDislikes(comment.dislikes_count);
                    setLocalReaction(comment.user_reaction);
                },
            }
        );
    };

    const handleEdit = () => {
        if (!editContent.trim()) return;

        // Optimistic update: langsung tampilkan konten baru
        const oldContent = localContent;
        setLocalContent(editContent);
        setEditing(false);

        router.put(`/comment/${comment.id}`, { content: editContent }, {
            onSuccess: () => {
                // sinkronisasi dari server
                if (filmId) {
                    router.get(`/film/${filmId}`, {}, { only: ['comments'], preserveScroll: true });
                }
            },
            onError: () => {
                // revert jika gagal
                setLocalContent(oldContent);
            },
        });
    };

    const handleDelete = () => {
        setShowDelete(false);

        // Optimistic update: langsung hapus dari UI
        const el = document.getElementById(`comment-${comment.id}`);
        if (el) {
            el.style.transition = 'all 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateX(-20px)';
            el.style.height = el.scrollHeight + 'px';
            setTimeout(() => {
                el.style.height = '0';
                el.style.marginBottom = '0';
                el.style.padding = '0';
                el.style.border = 'none';
            }, 150);
            setTimeout(() => el.remove(), 500);
        }

        router.delete(`/comment/${comment.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (filmId) {
                    router.get(`/film/${filmId}`, {}, { only: ['comments'], preserveScroll: true });
                }
            },
        });
    };

    return (
        <>
            <div
                id={`comment-${comment.id}`}
                className="flex gap-3 p-4 bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] transition-all duration-300"
            >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#242424] text-[#F5C518] text-sm font-bold border border-[#2D2D2D]">
                    {comment.user.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">{comment.user.name}</span>
                        <span className="text-[#666666] text-xs">{timeAgo(comment.created_at)}</span>
                    </div>

                    {editing ? (
                        <div className="space-y-2">
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="bg-[#242424] border-[#2D2D2D] text-white resize-none"
                                rows={3}
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleEdit}
                                    className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] h-7 px-3"
                                >
                                    <Check className="size-3 mr-1" /> Simpan
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => { setEditing(false); setEditContent(localContent); }}
                                    className="text-[#B3B3B3] hover:text-white h-7 px-3"
                                >
                                    <X className="size-3 mr-1" /> Batal
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-[#B3B3B3] text-sm leading-relaxed whitespace-pre-wrap">{localContent}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => handleReaction('like')}
                                    className={`flex items-center gap-1 text-xs transition-all duration-200 ${
                                        localReaction === 'like'
                                            ? 'text-[#4CAF50] scale-110'
                                            : 'text-[#666666] hover:text-[#B3B3B3]'
                                    }`}
                                    title="Suka"
                                >
                                    <span className={`transition-transform duration-200 ${likeAnimating ? 'scale-150' : ''}`}>
                                        <ThumbsUp className="size-3" />
                                    </span>
                                    {localLikes > 0 && <span>{localLikes}</span>}
                                </button>
                                <button
                                    onClick={() => handleReaction('dislike')}
                                    className={`flex items-center gap-1 text-xs transition-all duration-200 ${
                                        localReaction === 'dislike'
                                            ? 'text-[#E53935] scale-110'
                                            : 'text-[#666666] hover:text-[#B3B3B3]'
                                    }`}
                                    title="Tidak Suka"
                                >
                                    <span className={`transition-transform duration-200 ${dislikeAnimating ? 'scale-150' : ''}`}>
                                        <ThumbsDown className="size-3" />
                                    </span>
                                    {localDislikes > 0 && <span>{localDislikes}</span>}
                                </button>

                                {comment.is_owner && (
                                    <>
                                        <button
                                            onClick={() => { setEditing(true); setEditContent(localContent); }}
                                            className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#B3B3B3] transition-colors ml-auto"
                                        >
                                            <Edit2 className="size-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => setShowDelete(true)}
                                            className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#E53935] transition-colors"
                                        >
                                            <Trash2 className="size-3" /> Hapus
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Delete confirmation */}
            <Dialog open={showDelete} onOpenChange={setShowDelete}>
                <DialogContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-white">Hapus Komentar</DialogTitle>
                    </DialogHeader>
                    <p className="text-[#B3B3B3] text-sm">Apakah Anda yakin ingin menghapus komentar ini?</p>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setShowDelete(false)}
                            className="text-[#B3B3B3] hover:text-white"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-[#E53935] hover:bg-[#C62828]"
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
