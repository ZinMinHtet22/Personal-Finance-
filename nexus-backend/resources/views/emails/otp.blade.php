<x-mail::message>
# Verify your login

Here is your one-time password (OTP) to securely access your Nexus account:

<x-mail::panel>
# {{ $otp }}
</x-mail::panel>

This code is valid for 10 minutes. Please do not share it with anyone.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
