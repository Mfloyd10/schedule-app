import { parseSchedule } from '../utils/parseSchedule'

export default function Schedule() {
    const handleFile = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
            const result = parseSchedule(event.target.result)
            console.log(result)
        }
        reader.readAsText(file)
    }

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFile} />
        </div>
    )
}