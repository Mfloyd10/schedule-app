export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { phone, message } = req.body

    try {
        const response = await fetch('https://textbelt.com/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone,
                message,
                key: process.env.TEXTBELT_KEY
            })
        })

        const data = await response.json()
        console.log('Textbelt response:', data)
        res.status(200).json(data)
    } catch (error) {
        console.error('Textbelt error:', error)
        res.status(500).json({ error: error.message })
    }
}