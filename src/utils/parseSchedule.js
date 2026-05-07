export function parseSchedule(csvText) {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())

    const nameIdx = headers.indexOf('Employee Names')
    const dateIdx = headers.indexOf('Start Date')
    const startIdx = headers.indexOf('Start Time')
    const endIdx = headers.indexOf('End Time')

    const calcHours = (start, end) => {
        const toMinutes = (timeStr) => {
            const period = timeStr.slice(-2)
            const [hours, minutes] = timeStr.slice(0, -2).split(':').map(Number)
            let h = hours
            if (period === 'PM' && h !== 12) h += 12
            if (period === 'AM' && h === 12) h = 0
            return h * 60 + minutes
        }
        const diff = toMinutes(end) - toMinutes(start)
        return Math.round((diff / 60) * 10) / 10
    }

    const employees = {}

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].match(/(".*?"|[^,]+)(?=,|$)/g)
            ?.map(c => c.replace(/"/g, '').trim())
        if (!cols) continue

        const name = cols[nameIdx]
        const date = cols[dateIdx]
        const start = cols[startIdx]
        const end = cols[endIdx]

        if (!name || !date || !start || !end) continue

        const hours = calcHours(start, end)

        if (!employees[name]) {
            employees[name] = { name, shifts: [], totalHours: 0 }
        }

        employees[name].shifts.push({ date, start, end, hours })
        employees[name].totalHours += hours
    }

    return Object.values(employees).sort((a, b) => a.name.localeCompare(b.name))
}