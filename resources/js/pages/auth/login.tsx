import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { Button, Checkbox, HelperText, Label, TextInput } from 'flowbite-react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Masuk RIFA-WQ" description="Masukkan email dan kata sandi di bawah ini untuk masuk">
            <Head title="Log in" />
            <Form method="post" action={route('login')} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div>
                                <Label htmlFor="email" className="mb-1">
                                    Email
                                </Label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    color={errors.email ? 'failure' : undefined}
                                />
                                <HelperText className="text-xs font-light text-red-800">{errors.email}</HelperText>
                            </div>

                            <div>
                                <div className="mb-1 flex justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <a href={route('password.request')} className="ml-auto text-sm text-blue-600 hover:underline" tabIndex={5}>
                                            Lupa password?
                                        </a>
                                    )}
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    color={errors.password ? 'failure' : undefined}
                                />
                                <HelperText className="text-xs font-light text-red-800">{errors.password}</HelperText>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Ingat saya</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Masuk
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                Tidak punya akun?{' '}
                                <a href={route('register')} className="text-blue-600 hover:underline" tabIndex={5}>
                                    Daftar
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
