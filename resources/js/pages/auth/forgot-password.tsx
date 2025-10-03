import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Lupa Password" description="Masukkan name akun anda untuk menerima tautan reset password">
            <Head title="Forgot password" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <TextInput
                            id="name"
                            type="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="off"
                            autoFocus
                            placeholder="Nama pengguna"
                            color={errors.name ? 'failure' : undefined}
                            required
                        />
                        <HelperText className="text-xs font-light text-red-800">{errors.name}</HelperText>
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Kirim Tautan Reset Password
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Atau, kembali ke halaman</span>
                    <Link href={route('login')} className="text-blue-600 hover:underline">
                        Masuk
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
