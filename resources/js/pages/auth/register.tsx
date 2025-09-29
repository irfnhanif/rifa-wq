import { Form, Head, Link } from '@inertiajs/react';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';
import { LoaderCircle } from 'lucide-react';

import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Buat Akun RIFA-WQ" description="Masukkan detail registrasi di bawah ini untuk membuat akun">
            <Head title="Register" />
            <Form
                method="post"
                action={route('register')}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-1">
                                <Label htmlFor="name">Nama</Label>
                                <TextInput
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="nama lengkap"
                                />
                                <HelperText className="text-xs font-light text-red-800">{errors.name}</HelperText>
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="email">Email</Label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <HelperText className="text-xs font-light text-red-800">{errors.email}</HelperText>
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="password">Password</Label>
                                <TextInput
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <HelperText className="text-xs font-light text-red-800">{errors.password}</HelperText>
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="password_confirmation">Konfirmasi  password</Label>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <HelperText className="text-xs font-light text-red-800">{errors.password_confirmation}</HelperText>
                            </div>
                            <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Daftar
                            </Button>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} tabIndex={6}>
                                Masuk
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
