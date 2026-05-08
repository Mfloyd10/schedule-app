import { createEvents } from 'ics'

export function generateICS(employee) {
    const events = employee.shifts.map(shift => {
        const startDate = new Date(shift.date)
        const [startHour, startMin] = parseTime(shift.start)
        const [endHour, endMin] = parseTime(shift.end)

        return {
            title: 'Work - Little Caesars',
            start: [
                startDate.getFullYear(),
                startDate.getMonth() + 1,
                startDate.getDate(),
                startHour,
                startMin
            ],
            end: [
                startDate.getFullYear(),
                startDate.getMonth() + 1,
                startDate.getDate(),
                endHour,
                endMin
            ],
            description: `Shift for ${employee.name}`,
        }
    })

    const { error, value } = createEvents(events)
    if (error) {
        console.error(error)
        return null
    }

    return value
}

function parseTime(timeStr) {
    const period = timeStr.slice(-2)
    let [hours, minutes] = timeStr.slice(0, -2).split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return [hours, minutes]
}