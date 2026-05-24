const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up Nodemailer transporter
// NOTE: For Gmail, you MUST use an App Password instead of your regular password.
// Or, for testing, you can uncomment the ethereal setup below.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'khandelwalatharva0709@gmail.com', // Replace with your email
        pass: process.env.EMAIL_PASS || 'your_app_password_here' // Replace with your generated App Password
    }
});

// API Route for Contact Form
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER || 'khandelwalatharva0709@gmail.com', // Send to yourself
            subject: `Portfolio Contact: Message from ${name}`,
            text: `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message. Please check email configuration.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`Make sure to set up your EMAIL_USER and EMAIL_PASS in a .env file to send real emails.`);
});
