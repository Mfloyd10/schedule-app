import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

const sns = new SNSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { phone, message } = req.body
ver
    try {
        const command = new PublishCommand({
            PhoneNumber: phone,
            Message: message,
        })

        await sns.send(command)
        res.status(200).json({ success: true })
    } catch (error) {
        console.error('SNS error:', error)
        res.status(500).json({ error: error.message })
    }
}