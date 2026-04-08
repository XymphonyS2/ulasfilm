import type { BreadcrumbItem } from '@/types';

export default function FilmLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0D0D0D]">
            {children}
        </div>
    );
}
