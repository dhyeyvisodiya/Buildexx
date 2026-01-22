/**
 * Email Service
 * Handles all email notifications for BuildEx platform
 */

import sql from './db.js';

// Check if we're in Node.js environment
const isNodeEnv = typeof window === 'undefined';

// Email configuration - reads from Vite environment variables
const EMAIL_CONFIG = {
    host: import.meta.env?.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(import.meta.env?.EMAIL_PORT || '587'),
    secure: import.meta.env?.EMAIL_SECURE === 'true',
    user: import.meta.env?.EMAIL_USER || '',
    pass: import.meta.env?.EMAIL_PASS || '',
    from: import.meta.env?.EMAIL_FROM || 'BuildEx <noreply@buildex.com>'
};

let transporter = null;

// Only initialize email in Node.js environment
if (isNodeEnv && EMAIL_CONFIG.user && EMAIL_CONFIG.pass) {
    (async () => {
        try {
            const nodemailer = await import('nodemailer');
            transporter = nodemailer.default.createTransport({
                host: EMAIL_CONFIG.host,
                port: EMAIL_CONFIG.port,
                secure: EMAIL_CONFIG.secure,
                auth: {
                    user: EMAIL_CONFIG.user,
                    pass: EMAIL_CONFIG.pass
                }
            });
            console.log('✅ Email service initialized with:', EMAIL_CONFIG.user);
        } catch (error) {
            console.warn('Email service not available:', error.message);
        }
    })();
}

// Email Templates
const templates = {
    // Payment Confirmation - User
    paymentConfirmationUser: (data) => ({
        subject: `Payment Confirmed - ${data.propertyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                <div style="background: linear-gradient(135deg, #C8A24A, #9E7C2F); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">BuildEx</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1E293B;">Payment Successful! 🎉</h2>
                    <p style="color: #64748B;">Dear ${data.userName},</p>
                    <p style="color: #64748B;">Your payment has been successfully processed.</p>
                    
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #1E293B; margin-top: 0;">Payment Details</h3>
                        <p><strong>Property:</strong> ${data.propertyName}</p>
                        <p><strong>Amount:</strong> ₹${Number(data.amount).toLocaleString('en-IN')}</p>
                        <p><strong>Payment Type:</strong> ${data.paymentType}</p>
                        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                    </div>
                    
                    <p style="color: #64748B;">Thank you for choosing BuildEx!</p>
                </div>
            </div>
        `
    }),

    // Payment Notification - Builder
    paymentNotificationBuilder: (data) => ({
        subject: `New Payment Received - ${data.propertyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                <div style="background: linear-gradient(135deg, #C8A24A, #9E7C2F); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">BuildEx - Builder Dashboard</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1E293B;">New Payment Received! 💰</h2>
                    <p style="color: #64748B;">Dear ${data.builderName},</p>
                    <p style="color: #64748B;">You have received a new payment for your property.</p>
                    
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #1E293B; margin-top: 0;">Transaction Details</h3>
                        <p><strong>Property:</strong> ${data.propertyName}</p>
                        <p><strong>Amount:</strong> ₹${Number(data.amount).toLocaleString('en-IN')}</p>
                        <p><strong>Buyer:</strong> ${data.userName}</p>
                        <p><strong>Payment Type:</strong> ${data.paymentType}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                    </div>
                </div>
            </div>
        `
    }),

    // Rent Reminder
    rentReminder: (data) => ({
        subject: `Rent Payment Reminder - ${data.propertyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                <div style="background: linear-gradient(135deg, #C8A24A, #9E7C2F); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">BuildEx</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1E293B;">Rent Payment Reminder 📅</h2>
                    <p style="color: #64748B;">Dear ${data.userName},</p>
                    <p style="color: #64748B;">This is a friendly reminder that your rent payment is due soon.</p>
                    
                    <div style="background: #fffbeb; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #F59E0B;">
                        <p><strong>Property:</strong> ${data.propertyName}</p>
                        <p><strong>Amount Due:</strong> ₹${Number(data.amount).toLocaleString('en-IN')}</p>
                        <p><strong>Due Date:</strong> ${data.dueDate}</p>
                    </div>
                    
                    <p style="color: #64748B;">Please make your payment before the due date.</p>
                </div>
            </div>
        `
    }),

    // Rent Overdue
    rentOverdue: (data) => ({
        subject: `⚠️ Rent Overdue - ${data.propertyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                <div style="background: #DC2626; padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">BuildEx - Urgent Notice</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #DC2626;">Rent Payment Overdue ⚠️</h2>
                    <p style="color: #64748B;">Dear ${data.userName},</p>
                    
                    <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #DC2626;">
                        <p><strong>Property:</strong> ${data.propertyName}</p>
                        <p><strong>Amount Due:</strong> ₹${Number(data.amount).toLocaleString('en-IN')}</p>
                        <p><strong>Due Date:</strong> ${data.dueDate}</p>
                        <p><strong>Days Overdue:</strong> ${data.daysOverdue}</p>
                    </div>
                    
                    <p style="color: #DC2626;"><strong>Please make the payment immediately to avoid service suspension.</strong></p>
                </div>
            </div>
        `
    }),

    // Enquiry Notification
    enquiryNotification: (data) => ({
        subject: `New Enquiry - ${data.propertyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                <div style="background: linear-gradient(135deg, #C8A24A, #9E7C2F); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">BuildEx</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1E293B;">New Property Enquiry 📬</h2>
                    
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Property:</strong> ${data.propertyName}</p>
                        <p><strong>From:</strong> ${data.userName}</p>
                        <p><strong>Email:</strong> ${data.userEmail}</p>
                        <p><strong>Phone:</strong> ${data.userPhone}</p>
                        <p><strong>Message:</strong> ${data.message}</p>
                    </div>
                </div>
            </div>
        `
    }),

    // Welcome Email
    welcome: (data) => ({
        subject: `Welcome to BuildEx, ${data.userName}! 🏠`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                <div style="background: linear-gradient(135deg, #C8A24A, #9E7C2F); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">Welcome to BuildEx!</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1E293B;">Hello ${data.userName}! 👋</h2>
                    <p style="color: #64748B;">Thank you for joining BuildEx - your premium real estate platform.</p>
                    
                    <ul style="color: #64748B;">
                        <li>Browse premium properties</li>
                        <li>Buy or rent with secure payments</li>
                        <li>Connect directly with builders</li>
                    </ul>
                </div>
            </div>
        `
    })
};

/**
 * Send email using the configured transporter
 */
export async function sendEmail(to, templateName, data) {
    if (!transporter) {
        console.log(`📧 [EMAIL LOG] To: ${to}, Template: ${templateName}`);
        console.log('   Data:', JSON.stringify(data, null, 2));
        return { success: true, message: 'Email logged (transporter not configured)' };
    }

    try {
        const template = templates[templateName];
        if (!template) {
            throw new Error(`Unknown email template: ${templateName}`);
        }

        const { subject, html } = template(data);

        const result = await transporter.sendMail({
            from: EMAIL_CONFIG.from,
            to,
            subject,
            html
        });

        console.log(`✅ Email sent: ${templateName} to ${to}`);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send payment confirmation emails
 */
export async function sendPaymentEmails(paymentData) {
    const { userId, builderId, propertyId, amount, paymentType, transactionId } = paymentData;

    try {
        const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`;
        const [builder] = await sql`SELECT * FROM users WHERE id = ${builderId}`;
        const [property] = await sql`SELECT * FROM properties WHERE id = ${propertyId}`;

        if (!user || !builder || !property) {
            console.error('Missing data for payment emails');
            return;
        }

        // Email to user
        await sendEmail(user.email, 'paymentConfirmationUser', {
            userName: user.full_name || user.username,
            propertyName: property.title,
            amount,
            paymentType: paymentType === 'BUY' ? 'Property Purchase' : 'Rent Payment',
            transactionId
        });

        // Email to builder
        await sendEmail(builder.email, 'paymentNotificationBuilder', {
            builderName: builder.full_name || builder.username,
            propertyName: property.title,
            userName: user.full_name || user.username,
            amount,
            paymentType: paymentType === 'BUY' ? 'Property Purchase' : 'Rent Payment'
        });

    } catch (error) {
        console.error('Error sending payment emails:', error);
    }
}

export default {
    sendEmail,
    sendPaymentEmails
};
