import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { parseSchedule } from '../utils/parseSchedule'
import { sendSchedule } from '../utils/sendSchedule'

export default function Schedule() {
    const [parsedEmployees, setParsedEmployees] = useState([])
    const [sending, setSending] = useState(false)
    const [results, setResults] = useState([])

    const handleFile = async (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onload = async (event) => {
            const parsed = parseSchedule(event.target.result)

            const { data: dbEmployees } = await supabase
                .from('employees')
                .select('*')

            const matched = parsed.map(emp => {
                const found = dbEmployees.find(db =>
                    db.name.toLowerCase() === emp.name.toLowerCase()
                )
                return {
                    ...emp,
                    phone: found?.phone || null,
                    email: found?.email || null,
                    hasContact: !!found,
                    selected: !!found
                }
            })

            setParsedEmployees(matched)
        }

        reader.readAsText(file)
    }

    const toggleEmployee = (name) => {
        setParsedEmployees(prev =>
            prev.map(emp =>
                emp.name === name ? { ...emp, selected: !emp.selected } : emp
            )
        )
    }

    const handleSend = async () => {
        setSending(true)
        const toSend = parsedEmployees.filter(emp => emp.hasContact && emp.selected)
        const res = await sendSchedule(toSend)
        setResults(res)
        setSending(false)
    }

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFile} />

            {parsedEmployees.length > 0 && (
                <div>
                    {parsedEmployees.map(emp => (
                        <div key={emp.name}>
                            <input
                                type="checkbox"
                                checked={emp.selected}
                                onChange={() => toggleEmployee(emp.name)}
                                disabled={!emp.hasContact}
                            />
                            <span>{emp.name}</span>
                            <span>{emp.totalHours}hrs</span>
                            <span>{emp.hasContact ? '✅ ready' : '⚠️ not in employees list'}</span>
                        </div>
                    ))}
                    <button onClick={handleSend} disabled={sending}>
                        {sending ? 'Sending...' : 'Send all schedules'}
                    </button>
                </div>
            )}

            {results.length > 0 && (
                <div>
                    {results.map(r => (
                        <div key={r.name}>
                            <span>{r.name}</span>
                            <span>{r.smsSent ? '📱 SMS sent' : ''}</span>
                            <span>{r.emailSent ? '📧 Email sent' : ''}</span>
                            <span>{r.error ? `❌ ${r.error}` : ''}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}