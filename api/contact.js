const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Enable CORS for localhost testing (Vercel automatically handles this in production based on vercel.json if needed, but this allows local testing)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'khandelwalatharva0709@gmail.com', // Replace via Vercel env variable
            pass: process.env.EMAIL_PASS || 'exoswgjesbqfkvqa' // Replace via Vercel env variable
        }
    });

    try {
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER || 'khandelwalatharva0709@gmail.com', 
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
};
