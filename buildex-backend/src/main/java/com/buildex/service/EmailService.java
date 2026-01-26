package com.buildex.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

        private final JavaMailSender mailSender;

        @Value("${spring.mail.username}")
        private String fromEmail;

        // Premium Template Wrapper with Theme Support
        // themeColor options: "#D4AF37" (Gold/Default), "#047857" (Green/Success),
        // "#1a365d" (Blue/Info), "#e53e3e" (Red/Alert)
        private String wrapHtmlContext(String title, String heading, String content, String themeColor) {
                if (themeColor == null)
                        themeColor = "#D4AF37"; // Default Gold

                return "<!DOCTYPE html>" +
                                "<html>" +
                                "<head>" +
                                "<style>" +
                                "  body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; -webkit-font-smoothing: antialiased; }"
                                +
                                "  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-top: 40px; margin-bottom: 40px; }"
                                +
                                "  .header { background: linear-gradient(135deg, #0B1C30 0%, #1a365d 100%); padding: 40px 0; text-align: center; position: relative; }"
                                +
                                "  .header::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, "
                                + themeColor + ", #ffffff); }" +
                                "  .brand { color: #D4AF37; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }"
                                +
                                "  .tagline { color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }"
                                +
                                "  .content { padding: 40px; }" +
                                "  .heading { color: #1a202c; font-size: 24px; font-weight: 600; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #edf2f7; padding-bottom: 15px; }"
                                +
                                "  .text { color: #4a5568; line-height: 1.7; font-size: 16px; }" +
                                "  .footer { background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #edf2f7; }"
                                +
                                "  .footer-text { color: #718096; font-size: 13px; margin: 5px 0; }" +
                                "  .btn { display: inline-block; background-color: " + themeColor
                                + "; color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 25px; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0, 0.2); }"
                                +
                                "  .highlight-box { background-color: #f8fafc; border-left: 4px solid " + themeColor
                                + "; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }" +
                                "  .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }" +
                                "  .data-cell { padding: 12px 0; border-bottom: 1px solid #edf2f7; color: #4a5568; }" +
                                "  .label-cell { width: 35%; color: #718096; font-weight: 500; }" +
                                "  .value-cell { font-weight: 600; color: #2d3748; }" +
                                "  .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; background-color: "
                                + themeColor + "20; color: " + themeColor + "; border: 1px solid " + themeColor + "; }"
                                +
                                "</style>" +
                                "</head>" +
                                "<body>" +
                                "  <div class=\"container\">" +
                                "    <div class=\"header\">" +
                                "      <h1 class=\"brand\">BUILDEX</h1>" +
                                "      <div class=\"tagline\">Premium Real Estate Marketplace</div>" +
                                "    </div>" +
                                "    <div class=\"content\">" +
                                "      <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;\">"
                                +
                                "        <h2 class=\"heading\" style=\"border:none; margin:0;\">" + heading + "</h2>" +
                                "      </div>" +
                                "      <div style=\"height:2px; background:#edf2f7; width:100%; margin-bottom:20px;\"></div>"
                                +
                                "      <div class=\"text\">" + content + "</div>" +
                                "      <div style=\"text-align: center;\">" +
                                "        <a href=\"http://localhost:5173\" class=\"btn\">Visit Dashboard</a>" +
                                "      </div>" +
                                "    </div>" +
                                "    <div class=\"footer\">" +
                                "      <p class=\"footer-text\">&copy; 2026 Buildex Real Estate. All rights reserved.</p>"
                                +
                                "      <p class=\"footer-text\">123 Business Avenue, Tech City</p>" +
                                "    </div>" +
                                "  </div>" +
                                "</body>" +
                                "</html>";
        }

        @Async
        public void sendHtmlEmail(String toEmail, String subject, String content) {
                try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                        helper.setFrom(fromEmail);
                        helper.setTo(toEmail);
                        helper.setSubject(subject);
                        helper.setText(content, true); // true = HTML

                        mailSender.send(message);
                        System.out.println("HTML Email sent successfully to: " + toEmail);
                } catch (MessagingException e) {
                        System.err.println("Failed to send HTML email to " + toEmail + ": " + e.getMessage());
                        e.printStackTrace();
                }
        }

        // Test Email (Public method for Controller)
        public void sendTestEmail(String toEmail) {
                String content = "<p>Hello,</p>" +
                                "<p>This is a <strong>Test Email</strong> to verify that the Buildex email system is working correctly.</p>"
                                +
                                "<div class=\"highlight-box\">" +
                                "  <p style=\"margin:0\"><strong>System Status:</strong> <span class=\"status-badge\">OPERATIONAL</span></p>"
                                +
                                "</div>" +
                                "<p>If you see this branded template, the HTML injection is successful.</p>";

                // Use a nice Blue theme for Info/Test
                sendHtmlEmail(toEmail, "Buildex System Test",
                                wrapHtmlContext("System Test", "System Configuration Success", content, "#3182ce"));
        }

        // 1. OTP Email
        public void sendOtpEmail(String toEmail, String otp) {
                String content = "<p>Hello,</p>" +
                                "<p>Thank you for choosing Buildex. Please verify your account using the code below:</p>"
                                +
                                "<div style=\"text-align: center; margin: 30px 0;\">" +
                                "  <div style=\"font-size: 36px; font-weight: 800; color: #2d3748; letter-spacing: 12px; background: #EDF2F7; padding: 20px 40px; border-radius: 12px; display:inline-block; border-bottom: 4px solid #D4AF37;\">"
                                + otp + "</div>" +
                                "</div>" +
                                "<p>This code expires in <strong>10 minutes</strong>.</p>";

                sendHtmlEmail(toEmail, "Verify Your Buildex Account",
                                wrapHtmlContext("Account Verification", "Security Check", content, "#D4AF37"));
        }

        // 2. Welcome Email
        public void sendWelcomeEmail(String toEmail, String name, String role) {
                String content = "<p>Dear <strong>" + name + "</strong>,</p>" +
                                "<p>Welcome to the <strong>Buildex</strong> family! Your account has been successfully verified.</p>"
                                +
                                "<div class=\"highlight-box\">" +
                                "  <p style=\"margin:0\">Role: <strong style=\"text-transform:uppercase;\">" + role
                                + "</strong></p>" +
                                "</div>" +
                                "<p>Start your premium real estate journey today.</p>";

                sendHtmlEmail(toEmail, "Welcome to Buildex",
                                wrapHtmlContext("Welcome", "Welcome Aboard!", content, "#1a365d")); // Blue Theme
        }

        // 3. Enquiry Received (To Builder)
        public void sendEnquiryReceivedEmail(String builderEmail, String builderName, String customerName,
                        String customerEmail, String customerPhone, String propertyName, String message) {
                String content = "<p>Dear " + builderName + ",</p>" +
                                "<p>You have a new enquiry for <strong>" + propertyName + "</strong>.</p>" +
                                "<table class=\"data-table\">" +
                                "  <tr><td class=\"data-cell label-cell\">Name</td><td class=\"data-cell value-cell\">"
                                + customerName + "</td></tr>" +
                                "  <tr><td class=\"data-cell label-cell\">Email</td><td class=\"data-cell value-cell\"><a href=\"mailto:"
                                + customerEmail + "\">" + customerEmail + "</a></td></tr>" +
                                "  <tr><td class=\"data-cell label-cell\">Phone</td><td class=\"data-cell value-cell\">"
                                + customerPhone + "</td></tr>" +
                                "</table>" +
                                "<p><strong>Message:</strong></p>" +
                                "<div style=\"background: #fff; padding: 15px; border-left: 4px solid #805ad5; font-style: italic; background-color:#faf5ff;\">"
                                +
                                "  \"" + message + "\"" +
                                "</div>";

                sendHtmlEmail(builderEmail, "New Enquiry: " + propertyName,
                                wrapHtmlContext("Enquiry", "New Lead", content, "#805ad5")); // Purple Theme
        }

        // 4. Payment Success (To User)
        public void sendPaymentSuccessEmail(String userEmail, String userName, String propertyName, String amount,
                        String transactionId) {
                String content = "<p>Dear " + userName + ",</p>" +
                                "<p>Payment successful for <strong>" + propertyName + "</strong>.</p>" +
                                "<div style=\"text-align: center; margin: 25px 0;\">" +
                                "  <div style=\"background-color: #047857; color: white; padding: 15px 40px; border-radius: 50px; display: inline-block; font-weight: bold; box-shadow: 0 4px 6px rgba(4, 120, 87, 0.2);\">"
                                +
                                "    PAID: ₹" + amount +
                                "  </div>" +
                                "</div>" +
                                "<table class=\"data-table\">" +
                                "  <tr><td class=\"data-cell label-cell\">Transaction ID</td><td class=\"data-cell value-cell\" style=\"font-family:monospace\">"
                                + transactionId + "</td></tr>" +
                                "  <tr><td class=\"data-cell label-cell\">Status</td><td class=\"data-cell value-cell\"><span class=\"status-badge\" style=\"background:#d1fae5; color:#047857; border:none;\">CONFIRMED</span></td></tr>"
                                +
                                "</table>";

                sendHtmlEmail(userEmail, "Receipt: " + propertyName,
                                wrapHtmlContext("Payment Success", "Transaction Confirmed", content, "#047857")); // Green
                                                                                                                  // Theme
        }

        // 5. Payment Received (To Builder)
        public void sendPaymentReceivedEmail(String builderEmail, String builderName, String propertyName,
                        String amount, String customerName) {
                String content = "<p>Dear " + builderName + ",</p>" +
                                "<p>Payment received for <strong>" + propertyName + "</strong>.</p>" +
                                "<div class=\"highlight-box\">" +
                                "  <h2 style=\"margin:0; color:#047857;\">₹" + amount + "</h2>" +
                                "  <p style=\"margin:5px 0 0; font-size:12px; color:#718096;\">CREDITED</p>" +
                                "</div>" +
                                "<table class=\"data-table\">" +
                                "  <tr><td class=\"data-cell label-cell\">Payer</td><td class=\"data-cell value-cell\">"
                                + customerName + "</td></tr>" +
                                "  <tr><td class=\"data-cell label-cell\">Date</td><td class=\"data-cell value-cell\">"
                                + java.time.LocalDate.now() + "</td></tr>" +
                                "</table>";

                sendHtmlEmail(builderEmail, "Payment Received: " + propertyName,
                                wrapHtmlContext("Funds Received", "Payment Notification", content, "#047857")); // Green
                                                                                                                // Theme
        }

        // 6. Rent Request (To Builder)
        public void sendRentRequestEmail(String builderEmail, String builderName, String customerName,
                        String email, String phone, String propertyName, String moveInDate, String message) {
                String content = "<p>Dear " + builderName + ",</p>" +
                                "<p>New rental application for <strong>" + propertyName + "</strong>.</p>" +
                                "<table class=\"data-table\">" +
                                "  <tr><td class=\"data-cell label-cell\">Name</td><td class=\"data-cell value-cell\">"
                                + customerName + "</td></tr>" +
                                "  <tr><td class=\"data-cell label-cell\">Contact</td><td class=\"data-cell value-cell\">"
                                + phone + "</td></tr>" +
                                "  <tr><td class=\"data-cell label-cell\">Move-In</td><td class=\"data-cell value-cell\">"
                                + moveInDate + "</td></tr>" +
                                "</table>" +
                                "<div style=\"background: #fff; padding: 15px; border-left: 4px solid #dd6b20; background-color:#fffaf0; font-style: italic;\">"
                                +
                                "  \"" + message + "\"" +
                                "</div>";

                sendHtmlEmail(builderEmail, "Rent Application: " + propertyName,
                                wrapHtmlContext("Rent Request", "Application Details", content, "#dd6b20")); // Orange
                                                                                                             // Theme
        }
}
