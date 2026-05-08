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

    const { to, subject, html, icsData, employeeName } = req.body

    try {
        const mailOptions = {
            from: `"A Slice of Time" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        }

        if (icsData) {
            mailOptions.attachments = [
                {
                    filename: `schedule-${employeeName.replace(' ', '-')}.ics`,
                    content: icsData,
                    contentType: 'text/calendar',
                }
            ]
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent:', info.messageId)
        res.status(200).json({ success: true })
    } catch (error) {
        console.error('Gmail error:', error)
        res.status(500).json({ error: error.message })
    }
}