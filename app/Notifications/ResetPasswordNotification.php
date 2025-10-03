<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{

    protected $userName;

    public function __construct($token, $userName = null) {
        parent::__construct($token);
        $this->userName = $userName;
    }

    public function toMail($notifiable): MailMessage
    {
        if (! $this->token) {
            return (new MailMessage)
                ->error()
                ->subject('Password Reset Error')
                ->line('There was an error processing your password reset request.');
        }

        $url = $this->resetUrl($notifiable);

        return (new MailMessage)
            ->subject('Reset Password - ' . config('app.name'))
            ->greeting('Halo!')
            ->line("Anda menerima email ini karena kami menerima permintaan reset password untuk akun: {$this->userName}.")
            ->action('Reset Password', $url)
            ->line('Link reset password ini akan kadaluarsa dalam ' . config('auth.passwords.users.expire') . ' menit.')
            ->line('Jika Anda tidak meminta reset password, tidak ada tindakan lebih lanjut yang diperlukan.')
            ->salutation('Salam, Tim ' . config('app.name'));
    }

    protected function resetUrl($notifiable): string
    {
        return url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));
    }
}
