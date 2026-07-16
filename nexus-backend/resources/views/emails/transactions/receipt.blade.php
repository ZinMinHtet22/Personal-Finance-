<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nexus Transaction Receipt</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #0f172a; padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
        .amount-box { background-color: #f1f5f9; border-left: 4px solid #4f46e5; padding: 20px; margin: 25px 0; border-radius: 4px; }
        .amount { font-size: 32px; font-weight: 700; color: #0f172a; margin: 5px 0 0 0; }
        .footer { padding: 20px 30px; text-align: center; font-size: 14px; color: #64748b; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>NEXUS</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $name }}</strong>,</p>
            <p>This is a confirmation that your recent transaction was successfully processed.</p>
            
            <div class="amount-box">
                <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Amount Processed</p>
                <h2 class="amount">${{ number_format($amount, 2) }}</h2>
            </div>
            
            <p>If you did not authorize this transaction, please contact our fraud department immediately.</p>
            <p>Securely yours,<br>The Nexus Security Team</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Nexus Financial. All rights reserved.
        </div>
    </div>
</body>
</html>
