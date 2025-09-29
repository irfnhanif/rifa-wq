import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import AuthLayout from '@/layouts/auth-layout';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout title="Reset Password" description="Masukkan email akun anda">
            <Head title="Reset password" />

            <Form
                method="post"
                action={route('password.store')}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="mt-1 block w-full"
                                readOnly
                                color={errors.email ? 'failure' : undefined}
                            />
                            <HelperText className="text-xs font-light text-red-800">{errors.email}</HelperText>
                        </div>

                        <div className="grid gap-2">
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

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
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
