import { Resend } from 'resend';

// Use the API key from your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

// Map agent IDs to their emails
const AGENT_EMAILS: Record<number, string> = {
  9: 'tianahtish@gmail.com',
  7: 'joellembithi@gmail.com',
  // Add more agents here
};

interface AgentEmailOptions {
  agentId: number;
  agentName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  subject?: string;
}

export async function sendAgentEmail(options: AgentEmailOptions) {
  try {
    const toEmail =
      process.env.NODE_ENV === 'production'
        ? AGENT_EMAILS[options.agentId] || options.agentName
        : 'joellembithi@gmail.com';

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const { data, error } = await resend.emails.send({
      from: 'AutoRent Pro <onboarding@resend.dev>',
      to: toEmail,
      subject: options.subject || `New inquiry from ${options.customerName}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Customer Inquiry</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DM Sans', Georgia, sans-serif;
      background-color: #f5f0eb;
      color: #2c2420;
      -webkit-font-smoothing: antialiased;
      padding: 32px 16px;
    }

    .wrap {
      max-width: 580px;
      margin: 0 auto;
    }

    .top-bar {
      text-align: center;
      margin-bottom: 28px;
    }

    .wordmark {
      font-family: 'Lora', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: #2c2420;
      letter-spacing: 0.02em;
    }

    .wordmark span {
      color: #c0622a;
    }

    .card {
      background: #fffdf9;
      border: 1px solid #e8ddd4;
      border-radius: 6px;
      overflow: hidden;
    }

    .card-header {
      background-color: #2c2420;
      padding: 28px 36px;
    }

    .card-header p {
      font-family: 'Lora', Georgia, serif;
      font-size: 11px;
      font-weight: 400;
      color: #c0622a;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .card-header h1 {
      font-family: 'Lora', Georgia, serif;
      font-size: 24px;
      font-weight: 600;
      color: #f5f0eb;
      line-height: 1.3;
    }

    .card-body {
      padding: 36px;
    }

    .greeting {
      font-size: 16px;
      color: #2c2420;
      margin-bottom: 20px;
      line-height: 1.7;
    }

    .greeting strong {
      font-weight: 600;
    }

    .note {
      font-size: 14px;
      color: #7a6a60;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .divider {
      border: none;
      border-top: 1px solid #e8ddd4;
      margin: 28px 0;
    }

    .section-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c0622a;
      margin-bottom: 16px;
    }

    .detail-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 1.5;
    }

    .detail-key {
      width: 80px;
      flex-shrink: 0;
      color: #9a8880;
      font-size: 13px;
    }

    .detail-val {
      color: #2c2420;
      font-weight: 500;
    }

    .message-block {
      background-color: #f5f0eb;
      border-left: 3px solid #c0622a;
      padding: 20px 24px;
      border-radius: 0 4px 4px 0;
      margin: 8px 0 28px;
    }

    .message-block p {
      font-family: 'Lora', Georgia, serif;
      font-size: 15px;
      color: #2c2420;
      line-height: 1.8;
      font-style: italic;
    }

    .actions {
      margin-top: 32px;
      display: flex;
      gap: 12px;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 4px;
      letter-spacing: 0.01em;
    }

    .btn-dark {
      background-color: #2c2420;
      color: #f5f0eb;
    }

    .btn-outline {
      background-color: transparent;
      color: #2c2420;
      border: 1.5px solid #c8bdb5;
    }

    .footer {
      text-align: center;
      margin-top: 28px;
      padding-bottom: 8px;
    }

    .footer p {
      font-size: 12px;
      color: #9a8880;
      line-height: 1.7;
    }

    @media (max-width: 500px) {
      .card-body { padding: 24px 20px; }
      .card-header { padding: 24px 20px; }
      .actions { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top-bar">
      <div class="wordmark">Auto<span>Rent</span> Pro</div>
    </div>

    <div class="card">
      <div class="card-header">
        <p>Agent notification</p>
        <h1>You have a new inquiry</h1>
      </div>

      <div class="card-body">
        <p class="greeting">Hi <strong>${options.agentName}</strong>,</p>
        <p class="note">
          Someone reached out through your AutoRent Pro profile. Here are their details — try to follow up promptly for the best chance of converting.
        </p>

        <hr class="divider">

        <p class="section-label">Customer</p>
        <div class="detail-row">
          <span class="detail-key">Name</span>
          <span class="detail-val">${options.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Email</span>
          <span class="detail-val">${options.customerEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Phone</span>
          <span class="detail-val">${options.customerPhone}</span>
        </div>

        <hr class="divider">

        <p class="section-label">Their message</p>
        <div class="message-block">
          <p>${options.message}</p>
        </div>

        <div class="actions">
          <a href="mailto:${options.customerEmail}" class="btn btn-dark">Reply by email</a>
          <a href="tel:${options.customerPhone}" class="btn btn-outline">Call them</a>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>AutoRent Pro · support@autorentpro.com · +254 743 861 565</p>
      <p style="margin-top:4px;">This notification was sent from your agent profile page.</p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Hi ${options.agentName},

Someone reached out through your AutoRent Pro profile. Here are their details:

Name:  ${options.customerName}
Email: ${options.customerEmail}
Phone: ${options.customerPhone}

Their message:
"${options.message}"

Reply: ${options.customerEmail}
Call:  ${options.customerPhone}

—
AutoRent Pro · support@autorentpro.com · +254 743 861 565
      `,
    });

    clearTimeout(timeoutId);

    if (error) {
      console.error('Agent email error details:', error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Agent email error:', {
      
    });
    
    // Return a more graceful error instead of throwing
    return { 
      success: false, 
      error: 'Email service temporarily unavailable',
      details: error 
    };
  }
}

interface CustomerConfirmationOptions {
  to: string;
  customerName: string;
  agentName: string;
  agentEmail: string;
}

export async function sendCustomerConfirmation(options: CustomerConfirmationOptions) {
  try {
    const toEmail =
      process.env.NODE_ENV === 'production'
        ? options.to
        : 'joellembithi@gmail.com';

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const { data, error } = await resend.emails.send({
      from: 'AutoRent Pro <onboarding@resend.dev>',
      to: toEmail,
      subject: `We received your message - AutoRent Pro`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message received – AutoRent Pro</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DM Sans', Georgia, sans-serif;
      background-color: #f5f0eb;
      color: #2c2420;
      -webkit-font-smoothing: antialiased;
      padding: 32px 16px;
    }

    .wrap {
      max-width: 560px;
      margin: 0 auto;
    }

    .top-bar {
      text-align: center;
      margin-bottom: 28px;
    }

    .wordmark {
      font-family: 'Lora', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: #2c2420;
    }

    .wordmark span { color: #c0622a; }

    .card {
      background: #fffdf9;
      border: 1px solid #e8ddd4;
      border-radius: 6px;
      overflow: hidden;
    }

    .card-header {
      background-color: #c0622a;
      padding: 28px 36px;
    }

    .card-header p {
      font-family: 'Lora', Georgia, serif;
      font-size: 11px;
      color: #ffffff;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
      opacity: 0.9;
    }

    .card-header h1 {
      font-family: 'Lora', Georgia, serif;
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.35;
    }

    .card-body {
      padding: 36px;
    }

    .greeting {
      font-size: 16px;
      color: #2c2420;
      margin-bottom: 16px;
      line-height: 1.7;
    }

    .body-text {
      font-size: 15px;
      color: #4a3c36;
      line-height: 1.75;
      margin-bottom: 32px;
    }

    .divider {
      border: none;
      border-top: 1px solid #e8ddd4;
      margin: 28px 0;
    }

    .section-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c0622a;
      margin-bottom: 16px;
    }

    .detail-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 14px;
    }

    .detail-key {
      width: 100px;
      flex-shrink: 0;
      color: #9a8880;
      font-size: 13px;
    }

    .detail-val {
      color: #2c2420;
      font-weight: 500;
    }

    .reply-btn {
      display: inline-block;
      margin-top: 28px;
      padding: 12px 24px;
      background-color: #c0622a;
      color: #ffffff;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 4px;
    }

    .footer {
      text-align: center;
      margin-top: 28px;
      padding-bottom: 8px;
    }

    .footer p {
      font-size: 12px;
      color: #9a8880;
      line-height: 1.7;
    }

    @media (max-width: 500px) {
      .card-body { padding: 24px 20px; }
      .card-header { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top-bar">
      <div class="wordmark">Auto<span>Rent</span> Pro</div>
    </div>

    <div class="card">
      <div class="card-header">
        <p>Message received</p>
        <h1>We've received your message</h1>
      </div>

      <div class="card-body">
        <p class="greeting">Hi <strong>${options.customerName}</strong>,</p>
        <p class="body-text">
          Thank you for contacting AutoRent Pro. Your message has been received and forwarded to our support team.
        </p>

        <hr class="divider">

        <p class="section-label">Your agent</p>
        <div class="detail-row">
          <span class="detail-key">Name</span>
          <span class="detail-val">${options.agentName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Email</span>
          <span class="detail-val">${options.agentEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Response</span>
          <span class="detail-val">Within 1-2 hours</span>
        </div>

        <p class="body-text" style="margin-top:28px; margin-bottom:0;">
          If you have any additional information, feel free to reply to this email.
        </p>

        <a href="mailto:${options.agentEmail}" class="reply-btn">Contact ${options.agentName}</a>
      </div>
    </div>

    <div class="footer">
      <p>AutoRent Pro · support@autorentpro.com · +254 743 861 565</p>
      <p style="margin-top:4px;">© ${new Date().getFullYear()} AutoRent Pro. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    clearTimeout(timeoutId);

    if (error) {
      console.error('Customer confirmation error details:', error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Customer confirmation error:', {
      
    });
    
    // Return gracefully instead of throwing
    return { 
      success: false, 
      error: 'Email service temporarily unavailable',
      details: error 
    };
  }
}

// Password Reset Email Function
interface ResetPasswordOptions {
  to: string;
  userName: string;
  resetUrl: string;
  resetCode: string;
}

export async function sendResetPasswordEmail({ to, userName, resetUrl, resetCode }: ResetPasswordOptions) {
  try {
    const toEmail = process.env.NODE_ENV === 'production' ? to : 'joellembithi@gmail.com';

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const { data, error } = await resend.emails.send({
      from: 'AutoRent Pro <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Reset your AutoRent Pro password',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password – AutoRent Pro</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DM Sans', Georgia, sans-serif;
      background-color: #f5f0eb;
      color: #2c2420;
      -webkit-font-smoothing: antialiased;
      padding: 32px 16px;
    }

    .wrap {
      max-width: 540px;
      margin: 0 auto;
    }

    .top-bar {
      text-align: center;
      margin-bottom: 28px;
    }

    .wordmark {
      font-family: 'Lora', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: #2c2420;
    }

    .wordmark span { color: #c0622a; }

    .card {
      background: #fffdf9;
      border: 1px solid #e8ddd4;
      border-radius: 6px;
      overflow: hidden;
    }

    .card-header {
      background-color: #2c2420;
      padding: 28px 36px;
    }

    .card-header p {
      font-size: 11px;
      color: #9a8880;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .card-header h1 {
      font-family: 'Lora', Georgia, serif;
      font-size: 24px;
      font-weight: 600;
      color: #f5f0eb;
      line-height: 1.35;
    }

    .card-body {
      padding: 36px;
    }

    .greeting {
      font-size: 16px;
      margin-bottom: 16px;
      line-height: 1.7;
    }

    .body-text {
      font-size: 15px;
      color: #4a3c36;
      line-height: 1.75;
      margin-bottom: 28px;
    }

    .code-section {
      background: #f5e6d3;
      border: 2px dashed #c0622a;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }

    .code-label {
      font-size: 12px;
      color: #7a6a60;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .reset-code {
      font-family: 'Lora', monospace;
      font-size: 36px;
      font-weight: 700;
      color: #c0622a;
      letter-spacing: 4px;
      line-height: 1.2;
      margin-bottom: 12px;
    }

    .code-hint {
      font-size: 13px;
      color: #5a4c44;
    }

    .code-hint strong {
      color: #c0622a;
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: #9a8880;
      font-size: 12px;
      margin: 24px 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e8ddd4;
    }

    .divider span {
      margin: 0 12px;
      text-transform: uppercase;
    }

    .link-section {
      background: #f9f2ea;
      border: 1px solid #e8ddd4;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }

    .reset-btn {
      display: inline-block;
      padding: 13px 28px;
      background-color: #c0622a;
      color: #fffdf9;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 4px;
      letter-spacing: 0.01em;
      margin: 12px 0;
    }

    .url-text {
      font-size: 12px;
      color: #c0622a;
      word-break: break-all;
      background: #fffdf9;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #e8ddd4;
      font-family: monospace;
    }

    .warning {
      margin-top: 28px;
      padding: 16px 20px;
      background-color: #fdf6ee;
      border: 1px solid #e8ddd4;
      border-radius: 4px;
      font-size: 14px;
      color: #7a5a3c;
      line-height: 1.65;
    }

    .footer {
      text-align: center;
      margin-top: 28px;
      padding-bottom: 8px;
    }

    .footer p {
      font-size: 12px;
      color: #9a8880;
      line-height: 1.7;
    }

    @media (max-width: 500px) {
      .card-body { padding: 24px 20px; }
      .card-header { padding: 24px 20px; }
      .reset-code { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top-bar">
      <div class="wordmark">Auto<span>Rent</span> Pro</div>
    </div>

    <div class="card">
      <div class="card-header">
        <p>Account security</p>
        <h1>Password reset</h1>
      </div>

      <div class="card-body">
        <p class="greeting">Hi <strong>${userName}</strong>,</p>
        <p class="body-text">
          We received a request to reset the password on your AutoRent Pro account. Use one of the options below.
        </p>

        <div class="code-section">
          <div class="code-label">Your 6-digit reset code</div>
          <div class="reset-code">${resetCode}</div>
          <div class="code-hint">
            ⏱️ Expires in <strong>1 hour</strong>
          </div>
        </div>

        <div class="divider">
          <span>OR</span>
        </div>

        <div class="link-section">
          <p style="margin-bottom: 12px; color: #5a4c44;">Use the reset link instead:</p>
          <a href="${resetUrl}" class="reset-btn">Reset my password</a>
          
          <p style="margin: 16px 0 8px; font-size: 12px; color: #7a6a60;">
            If the button doesn't work, copy this link:
          </p>
          <div class="url-text">${resetUrl}</div>
        </div>

        <div class="warning">
          <strong>Didn't request this?</strong> You can safely ignore this email.
        </div>
      </div>
    </div>

    <div class="footer">
      <p>AutoRent Pro · support@autorentpro.com · +254 743 861 565</p>
      <p style="margin-top:4px;">© ${new Date().getFullYear()} AutoRent Pro. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Hi ${userName},

We received a request to reset the password on your AutoRent Pro account.

═══ YOUR 6-DIGIT RESET CODE ═══
${resetCode}

Enter this code on the password reset page at:
${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password

⏱️ This code expires in 1 hour.

═══ OR USE THE RESET LINK ═══
${resetUrl}

This link also expires in 1 hour.

Didn't request this? You can safely ignore this email.

—
AutoRent Pro · support@autorentpro.com · +254 743 861 565
      `,
    });

    clearTimeout(timeoutId);

    if (error) {
      console.error('Password reset email error details:', error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Password reset email error:', {
     
    });
    
    return { 
      success: false, 
      error: 'Email service temporarily unavailable',
      details: error 
    };
  }
}