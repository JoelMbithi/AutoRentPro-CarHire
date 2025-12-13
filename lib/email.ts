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

    const { data, error } = await resend.emails.send({
      from: 'AutoRent Pro <onboarding@resend.dev>',
      to: toEmail,
      subject: options.subject || `New Customer Inquiry - AutoRent Pro`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Customer Inquiry</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 20px 48px rgba(0, 0, 0, 0.03);
        }
        
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            padding: 40px 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            opacity: 0.15;
            transform: rotate(15deg);
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }
        
        .header p {
            font-size: 15px;
            opacity: 0.9;
            font-weight: 400;
        }
        
        .content {
            padding: 40px 32px;
        }
        
        .greeting {
            font-size: 18px;
            color: #1e293b;
            margin-bottom: 32px;
            line-height: 1.8;
        }
        
        .card {
            background: linear-gradient(to bottom right, #ffffff, #f8fafc);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 28px;
            margin: 24px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }
        
        .card-title {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #1e40af;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #dbeafe;
        }
        
        .card-title i {
            font-size: 20px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .info-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            font-size: 15px;
            color: #1e293b;
            font-weight: 500;
        }
        
        .message-box {
            background: linear-gradient(to right, #fef3c7, #fde68a);
            border-left: 4px solid #f97316;
            padding: 24px;
            border-radius: 8px;
            margin: 32px 0;
            position: relative;
        }
        
        .message-box::before {
            content: '"';
            position: absolute;
            top: -10px;
            left: 20px;
            font-size: 60px;
            color: #f97316;
            opacity: 0.2;
            font-family: Georgia, serif;
            line-height: 1;
        }
        
        .message-box p {
            font-size: 15px;
            color: #92400e;
            line-height: 1.7;
            font-style: italic;
            position: relative;
            z-index: 1;
        }
        
        .action-buttons {
            display: flex;
            gap: 16px;
            margin: 40px 0;
            justify-content: center;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 28px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            cursor: pointer;
            min-width: 180px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
        }
        
        .btn-secondary:hover {
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25);
        }
        
        .priority-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            color: #92400e;
            padding: 10px 18px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin: 24px 0;
            border: 1px solid #fbbf24;
        }
        
        .footer {
            background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            margin-top: 40px;
        }
        
        .footer-logo {
            color: #2563eb;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            display: block;
        }
        
        .footer-logo span {
            color: #10b981;
        }
        
        .footer-text {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .contact-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #475569;
        }
        
        @media (max-width: 640px) {
            .email-container {
                border-radius: 0;
            }
            
            .content {
                padding: 24px 20px;
            }
            
            .header {
                padding: 32px 24px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .action-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 280px;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1> New Customer Inquiry</h1>
            <p>AutoRent Pro Agent Portal</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                <strong>Hello ${options.agentName},</strong><br>
                A potential customer has sent you a message regarding your vehicle rental services.
            </div>
            
            <div class="priority-badge">
                <i>⏱️</i>
                <span>High Priority • Respond within 15 minutes for higher conversion rates!</span>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <i>👤</i>
                    <span>Customer Details</span>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Name</span>
                        <span class="info-value">${options.customerName}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email</span>
                        <span class="info-value">${options.customerEmail}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone</span>
                        <span class="info-value">${options.customerPhone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Source</span>
                        <span class="info-value">AutoRent Pro Platform</span>
                    </div>
                </div>
            </div>
            
            <div class="message-box">
                <h3 style="color: #dc2626; font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;">
                    <i></i>
                    <span>Customer Message</span>
                </h3>
                <p>${options.message}</p>
            </div>
            
            <div class="action-buttons">
                <a href="mailto:${options.customerEmail}" class="btn btn-primary">
                    <i >✉️ <p></p></i>
                    Reply via Email
                </a>
                <a href="tel:${options.customerPhone}" class="btn btn-secondary">
                    <i>📞 </i>
                    Call Customer
                </a>
            </div>
            
            <div class="footer">
                <div class="footer-logo">Auto<span>Rent</span> Pro</div>
                <div class="footer-text">
                    This message was sent from your AutoRent Pro profile page. 
                    Ensure timely follow-up to maintain your excellent service rating.
                </div>
                
                <div class="contact-info">
                    <div class="contact-item">
                        <i>🌐</i>
                        <span>autorentpro.com</span>
                    </div>
                    <div class="contact-item">
                        <i>📧</i>
                        <span>support@autorentpro.com</span>
                    </div>
                    <div class="contact-item">
                        <i>📱</i>
                        <span>+254 743 861 565</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
      `,
      text: `
New Customer Inquiry - AutoRent Pro

Hello ${options.agentName},

A potential customer has sent you a message:

Customer Details:
Name: ${options.customerName}
Email: ${options.customerEmail}
Phone: ${options.customerPhone}

Message:
${options.message}

---
Please respond to this inquiry promptly.
AutoRent Pro Agent Portal
      `,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Agent email error:', error);
    throw error;
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

    const { data, error } = await resend.emails.send({
      from: 'AutoRent Pro <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Message Sent Successfully - AutoRent Pro',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation - AutoRent Pro</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .confirmation-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }
        
        .success-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 40px 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .success-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.3;
        }
        
        .success-header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }
        
        .success-header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .main-content {
            padding: 40px 32px;
        }
        
        .thank-you h2 {
            font-size: 24px;
            color: #1e293b;
            margin-bottom: 16px;
            font-weight: 600;
        }
        
        .thank-you p {
            color: #64748b;
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 40px;
        }
        
        .thank-you strong {
            color: #1e40af;
        }
        
        .card {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #bae6fd;
            border-radius: 16px;
            padding: 28px;
            margin: 32px 0;
        }
        
        .card h3 {
            color: #1e40af;
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .info-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            font-size: 15px;
            color: #1e293b;
            font-weight: 500;
        }
        
        .cta-button {
            display: block;
            width: 100%;
            max-width: 300px;
            margin: 40px auto;
            text-align: center;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 28px;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            cursor: pointer;
            width: 100%;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(249, 115, 22, 0.25);
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
            line-height: 1.5;
        }
        
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            
            .confirmation-container {
                border-radius: 12px;
            }
            
            .main-content {
                padding: 32px 20px;
            }
            
            .success-header {
                padding: 32px 24px;
            }
            
            .success-header h1 {
                font-size: 24px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .btn {
                padding: 12px 24px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="confirmation-container">
        <div class="success-header">
            <h1>✓ Message Sent Successfully!</h1>
            <p>AutoRent Pro Vehicle Rental</p>
        </div>
        
        <div class="main-content">
            <div class="thank-you">
                <h2>Hello ${options.customerName},</h2>
                <p>Thank you for contacting <strong>${options.agentName}</strong> at AutoRent Pro.</p>
            </div>
            
            <div class="card">
                <h3>📞 Agent Contact Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Agent</span>
                        <span class="info-value">${options.agentName}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email</span>
                        <span class="info-value">${options.agentEmail}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Response Time</span>
                        <span class="info-value">Typically within 15 minutes</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Agent Rating</span>
                        <span class="info-value">4.8★ Excellent</span>
                    </div>
                </div>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                Your agent will review your inquiry and get back to you shortly.
            </p>
            
            <div class="cta-button">
                <a href="mailto:${options.agentEmail}" class="btn">
                    <i>✉️</i>
                    Send Another Message
                </a>
            </div>
            
            <div class="footer">
                <p>This is an automated confirmation. For urgent inquiries, please call +254 743 861 565</p>
                <p>© ${new Date().getFullYear()} AutoRent Pro. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
      `,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Customer confirmation error:', error);
    throw error;
  }
}