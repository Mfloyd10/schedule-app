import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { to, subject, html } = req.body

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            html,
        })
        res.status(200).json({ success: true })
    } catch (error) {
        console.error('Resend error:', error)
        res.status(500).json({ error: error.message })
    }
}