import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import AuthLayout from '@/layouts/auth-layout';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';

interface ResetPasswordProps {
    token: string;
    name: string;
}

export default function ResetPassword({ token, name }: ResetPasswordProps) {
    return (
        <AuthLayout title="Reset Password" description="Ganti password akun RIFA-WQ">
            <Head title="Reset password" />

            <Form
                method="post"
                action={route('password.store')}
                transform={(data) => ({ ...data, token, name })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-0.5">
                            <Label htmlFor="name">Nama</Label>
                            <TextInput
                                id="name"
                                type="name"
                                name="name"
                                autoComplete="name"
                                value={name}
                                className="mt-1 block w-full"
                                readOnly
                                color={errors.name ? 'failure' : undefined}
                            />
                            <HelperText className="text-xs font-light text-red-800">{errors.name}</HelperText>
                        </div>

                        <div className="grid gap-0.5">
                            <Label htmlFor="password">Password</Label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder="Password"
                                color={errors.password ? 'failure' : undefined}
                            />
                            <HelperText className="text-xs font-light text-red-800">{errors.password}</HelperText>
                        </div>

                        <div className="grid gap-0.5">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder="Confirm password"
                                color={errors.password_confirmation ? 'failure' : undefined}
                            />
                            <HelperText className="text-xs font-light text-red-800">{errors.password_confirmation}</HelperText>
                        </div>

                        <Button type="submit" className="mt-4 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Reset password
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
