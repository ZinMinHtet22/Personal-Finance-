<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Crypt;

class TransactionReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public string $userName;
    public string $encryptedAmount;

    /**
     * Create a new message instance.
     */
    public function __construct(string $userName, string $encryptedAmount)
    {
        $this->userName = $userName;
        $this->encryptedAmount = $encryptedAmount;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Nexus Transaction Receipt',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.transactions.receipt',
            with: [
                'name' => $this->userName,
                // Decrypt the amount securely at the exact time of rendering the view
                'amount' => Crypt::decryptString($this->encryptedAmount),
            ],
        );
    }
}
