import { Link, usePage } from '@inertiajs/react';
import { Search, Film, User, LogOut, Settings, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { login, logout, register, dashboard } from '@/routes';

export function Navbar() {
    const { auth } = usePage().props;
    const [search, setSearch] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const handleSearch = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (value.trim()) {
                window.location.href = `/film?q=${encodeURIComponent(value)}`;
            }
        }, 300);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[#2D2D2D] bg-[#0D0D0D]/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/beranda" className="flex items-center gap-2 shrink-0">
                    <Film className="size-6 text-[#F5C518]" strokeWidth={2.5} />
                    <span className="text-lg font-bold tracking-tight">
                        <span className="text-[#F5C518]">ulas</span>
                        <span className="text-white">.film</span>
                    </span>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-md mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#666666]" />
                        <Input
                            type="text"
                            placeholder="Cari film..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="h-9 w-full bg-[#1A1A1A] border-[#2D2D2D] pl-9 pr-4 text-sm text-white placeholder:text-[#666666] focus:border-[#F5C518] focus:ring-[#F5C518]/20"
                        />
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="hidden sm:flex items-center gap-1">
                    <Button variant="ghost" asChild className="text-[#B3B3B3] hover:text-white hover:bg-[#242424]">
                        <Link href="/film">List Film</Link>
                    </Button>
                </nav>

                {/* Auth */}
                {auth.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 text-[#B3B3B3] hover:text-white">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5C518] text-[#0D0D0D] text-sm font-bold">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden sm:block text-sm">{auth.user.name}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white w-48">
                            <DropdownMenuLabel className="text-[#B3B3B3]">
                                {auth.user.role === 'admin' ? 'Administrator' : 'Reviewer'}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#2D2D2D]" />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="text-[#B3B3B3] hover:text-white focus:text-white">
                                    <User className="mr-2 size-4" />
                                    Profil
                                </Link>
                            </DropdownMenuItem>
                            {auth.user.role === 'admin' && (
                                <DropdownMenuItem asChild>
                                    <Link href={dashboard()} className="text-[#B3B3B3] hover:text-white focus:text-white">
                                        <Shield className="mr-2 size-4" />
                                        Dashboard Admin
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-[#2D2D2D]" />
                            <DropdownMenuItem asChild>
                                <Link href={logout()} method="post" as="button" className="text-[#E53935] focus:text-[#E53935]">
                                    <LogOut className="mr-2 size-4" />
                                    Keluar
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild className="text-[#B3B3B3] hover:text-white text-sm">
                            <Link href={login()}>Masuk</Link>
                        </Button>
                        <Button asChild className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold text-sm">
                            <Link href={register()}>Daftar</Link>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
