import { generateICS } from './generateICS'

export async function sendSchedule(employees) {
    const results = []

    for (const emp of employees) {
        const result = { name: emp.name, smsSent: false, emailSent: false, error: null }

        // Send SMS if phone exists
        if (emp.phone) {
            try {
                const res = await fetch('/api/send-sms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: emp.phone,
                        message: buildSMSMessage(emp)
                    })
                })
                if (res.ok) result.smsSent = true
            } catch (err) {
                result.error = err.message
            }
        }

        // Send email if email exists
        if (emp.email) {
            try {
                const icsData = generateICS(emp)

                const res = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: emp.email,
                        subject: `Your schedule for the week of ${emp.shifts[0]?.date}`,
                        html: buildEmailHTML(emp),
                        icsData,
                        employeeName: emp.name
                    })
                })
                if (res.ok) result.emailSent = true
            } catch (err) {
                result.error = err.message
            }
        }

        results.push(result)
    }

    return results
}

function buildSMSMessage(emp) {
    const shifts = emp.shifts.map(s => `${s.date}: ${s.start} - ${s.end}`).join('\n')
    return `Hi ${emp.name.split(' ')[0]}! Here's your schedule:\n\n${shifts}\n\nTotal hours: ${emp.totalHours}hrs`
}

function buildEmailHTML(emp) {
    const shifts = emp.shifts.map(s => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0e8dc;">${s.date}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0e8dc;">${s.start} - ${s.end}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0e8dc; color: #d67b1c; font-weight: 600;">${s.hours}hrs</td>
    </tr>
  `).join('')

    return `
    <div style="font-family: Poppins, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: #291705; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">A Slice of Time</h1>
        <p style="color: #d67b1c; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px;">CREW SCHEDULE PORTAL</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px;">
        <p style="color: #291705; font-weight: 600;">Hi ${emp.name.split(' ')[0]}!</p>
        <p style="color: #666; font-size: 14px;">Here's your schedule for the upcoming week:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #fdfaf6;">
              <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #aaa; text-transform: uppercase;">Date</th>
              <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #aaa; text-transform: uppercase;">Shift</th>
              <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #aaa; text-transform: uppercase;">Hours</th>
            </tr>
          </thead>
          <tbody>${shifts}</tbody>
        </table>
        <div style="margin-top: 16px; padding: 12px; background: #fdfaf6; border-radius: 8px; text-align: center;">
          <span style="font-size: 14px; color: #291705; font-weight: 700;">Total hours: ${emp.totalHours}hrs</span>
        </div>
      </div>
    </div>
  `
}