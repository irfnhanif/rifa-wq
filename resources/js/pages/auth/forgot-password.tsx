import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout title="Lupa Password" description="Masukkan email akun anda untuk menerima tautan reset password">
            <Head title="Forgot password" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <Form method="post" action={route('password.email')}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    color={errors.email ? 'failure' : undefined}
                                />
                                <HelperText className="text-xs font-light text-red-800">{errors.email}</HelperText>
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button className="w-full" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Kirim Tautan Reset Password
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Atau, kembali ke halaman</span>
                    <Link href={route('login')} className="text-blue-600 hover:underline">
                        masuk
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
