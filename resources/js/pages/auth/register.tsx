import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />
            <Form
                action="/register"
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-[#B3B3B3]">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap Anda"
                                    className="bg-[#1A1A1A] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-[#B3B3B3]">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@contoh.com"
                                    className="bg-[#1A1A1A] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-[#B3B3B3]">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    className="bg-[#1A1A1A] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-[#B3B3B3]">
                                    Konfirmasi Kata Sandi
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    className="bg-[#1A1A1A] border-[#2D2D2D] text-white placeholder:text-[#666666]"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-[#F5C518] text-[#0D0D0D] hover:bg-[#E5B500] font-semibold disabled:opacity-50"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Daftar
                            </Button>
                        </div>

                        <div className="text-center text-sm text-[#B3B3B3]">
                            Sudah punya akun?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-[#F5C518]">
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun Baru',
    description: 'Masukkan detail Anda di bawah untuk membuat akun',
};
