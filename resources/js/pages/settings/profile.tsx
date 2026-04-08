import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { LogOut, User } from 'lucide-react';
import InputError from '@/components/input-error';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit, update } from '@/routes/profile';

export default function ProfilePage({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profil — ulas.film" />
            <div className="min-h-screen bg-[#0D0D0D]">
                <Navbar />

                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex items-center justify-center size-10 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/30">
                            <User className="size-5 text-[#F5C518]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Profil</h1>
                            <p className="text-[#666666] text-sm">Kelola informasi akun Anda</p>
                        </div>
                    </div>

                    {/* Form Ubah Username */}
                    <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] overflow-hidden mb-6">
                        <div className="px-6 py-5">
                            <h2 className="text-base font-semibold text-white mb-1">Informasi Profil</h2>
                            <p className="text-xs text-[#666666] mb-6">Update nama dan email akun Anda</p>

                            <Form
                                {...update.form()}
                                options={{ preserveScroll: true }}
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="name" className="text-[#B3B3B3] text-sm">
                                                    Nama
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    defaultValue={auth.user.name}
                                                    className="mt-1 bg-[#242424] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                                    placeholder="Nama lengkap"
                                                    required
                                                    autoComplete="name"
                                                />
                                                <InputError className="mt-1" message={errors.name} />
                                            </div>

                                            <div>
                                                <Label htmlFor="email" className="text-[#B3B3B3] text-sm">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={auth.user.email}
                                                    className="mt-1 bg-[#242424] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                                    placeholder="Alamat email"
                                                    required
                                                    autoComplete="email"
                                                />
                                                <InputError className="mt-1" message={errors.email} />

                                                {mustVerifyEmail && auth.user?.email_verified_at === null && (
                                                    <p className="mt-2 text-sm text-[#B3B3B3]">
                                                        Email Anda belum verifikasi.{' '}
                                                        <Link
                                                            href={edit()}
                                                            as="button"
                                                            className="text-[#F5C518] underline underline-offset-4 hover:decoration-[#E5B500]"
                                                        >
                                                            Klik di sini
                                                        </Link>{' '}
                                                        untuk kirim ulang.
                                                    </p>
                                                )}

                                                {status === 'verification-link-sent' && (
                                                    <p className="mt-2 text-sm text-[#4CAF50]">
                                                        Link verifikasi baru sudah dikirim ke email Anda.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-6">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold"
                                            >
                                                Simpan
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <span className="text-sm text-[#4CAF50]">Tersimpan</span>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                    {/* Keluar Akun */}
                    <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] overflow-hidden">
                        <div className="px-6 py-5">
                            <h2 className="text-base font-semibold text-white mb-1">Keluar Akun</h2>
                            <p className="text-xs text-[#666666] mb-4">
                                Anda saat ini login sebagai <span className="text-[#F5C518]">{auth.user?.name}</span>
                            </p>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-[#E53935] text-[#E53935] hover:bg-[#E53935]/10 hover:text-[#E53935] font-medium"
                                    >
                                        <LogOut className="size-4 mr-2" />
                                        Keluar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1A1A1A] border-[#2D2D2D] text-white max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Keluar dari akun?</DialogTitle>
                                        <DialogDescription className="text-[#B3B3B3]">
                                            Anda akan keluar dari akun ini. Perlu login ulang untuk mengakses kembali.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="text-[#B3B3B3] hover:text-white"
                                            >
                                                Batal
                                            </Button>
                                        </DialogTrigger>
                                        <form method="POST" action="/logout">
                                            <input
                                                type="hidden"
                                                name="_token"
                                                value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''}
                                            />
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                className="bg-[#E53935] hover:bg-[#C62828] text-white"
                                            >
                                                <LogOut className="size-4 mr-1" />
                                                Keluar
                                            </Button>
                                        </form>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
