import { Star } from 'lucide-react';
import { useState } from 'react';

type Props = {
    value: number | null;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

const sizeMap = { sm: 'size-3', md: 'size-5', lg: 'size-7' };

export function RatingStars({ value, onChange, readonly = false, size = 'md' }: Props) {
    const [hover, setHover] = useState<number | null>(null);
    const displayValue = hover ?? (value ?? 0);

    return (
        <div
            className={`flex items-center gap-1 ${!readonly ? 'cursor-pointer' : ''}`}
            onMouseLeave={() => !readonly && setHover(null)}
        >
            {[1, 2, 3, 4, 5].map((n) => {
                const filled = n <= displayValue;
                return (
                    <button
                        key={n}
                        type="button"
                        disabled={readonly}
                        onMouseEnter={() => !readonly && setHover(n)}
                        onClick={() => onChange?.(n)}
                        className={`${!readonly ? 'hover:scale-110 transition-transform' : ''} disabled:cursor-default`}
                    >
                        <Star
                            className={`${sizeMap[size]} transition-colors duration-150 ${
                                filled
                                    ? 'fill-[#F5C518] text-[#F5C518]'
                                    : 'fill-[#2D2D2D] text-[#2D2D2D]'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export function RatingDisplay({ value, count }: { value: number | null; count: number }) {
    if (!value) {
        return <span className="text-[#666666] text-sm">Belum ada rating</span>;
    }
    return (
        <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#F5C518]">{value.toFixed(1)}</span>
            <div className="flex items-center gap-1">
                <RatingStars value={Math.round(value)} readonly size="sm" />
            </div>
            <span className="text-[#B3B3B3] text-sm">({count} reviewer)</span>
        </div>
    );
}
