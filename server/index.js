import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initializeDatabase } from '../api/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Initialize DB
initializeDatabase().catch(err => console.error('DB Init Error:', err));

// In-memory store for OTPs (for demonstration/MVP)
const otpStore = new Map();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use 'smtp.ethereal.email' for testing
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// --- Routes ---

// Register / Send OTP
app.post('/api/auth/register', async (req, res) => {
  const { email, username } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const otp = generateOTP();
  otpStore.set(email, { otp, timestamp: Date.now(), userData: req.body });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'BuildEx Registration OTP',
    text: `Your OTP for BuildEx registration is: ${otp}. It is valid for 10 minutes.`
  };

  try {
    if (process.env.EMAIL_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}: ${otp}`); // Log for dev purposes
      res.json({ success: true, message: 'OTP sent successfully' });
    } else {
      console.warn('EMAIL_USER not set. OTP logged only.');
      console.log(`MOCK OTP for ${email}: ${otp}`);
      res.json({ success: true, message: 'OTP generated (Mock Mode)' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    // Detailed error logging
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json({ success: false, message: 'Failed to send OTP email', error: error.message });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'OTP expired or not found' });
  }

  if (storedData.otp === otp) {
    // OTP matches
    otpStore.delete(email); // clear OTP

    // Here we would normally insert into the real DB
    // For now, we return the user data to the frontend to "login"
    // In a real app, 'verify-otp' would create the user in the DB

    const user = {
      ...storedData.userData,
      id: Date.now(), // Mock ID
      created_at: new Date().toISOString()
    };

    // Remove password from response
    delete user.password;

    res.json({ success: true, message: 'User verified successfully', user });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

// Send Inquiry Email
app.post('/api/contact/send', async (req, res) => {
  const { to, subject, message, customerDetails } = req.body;
  // to: builder email, customerDetails: { name, email, phone }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to || process.env.EMAIL_USER, // Default to admin if no specific builder email
    subject: `New Inquiry: ${subject}`,
    text: `You have a new inquiry from ${customerDetails.name} (${customerDetails.email}, ${customerDetails.phone}).\n\nMessage:\n${message}`
  };

  try {
    if (process.env.EMAIL_USER) {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Inquiry sent' });
    } else {
      console.log('Mock Email Inquiry:', mailOptions);
      res.json({ success: true, message: 'Inquiry sent (Mock)' });
    }
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send inquiry' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email Service configured for: ${process.env.EMAIL_USER ? process.env.EMAIL_USER : 'NOT SET (Mock Mode)'}`);
});
