import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { to, subject, html } = req.body

    try {
        const info = await transporter.sendMail({
            from: `"A Slice of Time" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        })

        console.log('Email sent:', info.messageId)
        res.status(200).json({ success: true })
    } catch (error) {
        console.error('Gmail error:', error)
        res.status(500).json({ error: error.message })
    }
}