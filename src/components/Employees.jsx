import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Employees.css'
import { FaEdit } from "react-icons/fa";
import { IoPersonRemoveSharp } from "react-icons/io5";


export default function Employees() {

    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newEmployeeName, setNewEmployeeName] = useState('')
    const [newEmployeeEmail, setNewEmployeeEmail] = useState('')
    const [newEmployeePhone, setNewEmployeePhone] = useState('')

    const [editingEmployee, setEditingEmployee] = useState(null)
    const [editName, setEditName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editPhone, setEditPhone] = useState('')

    const handleAddEmployee = async (e) => {
        e.preventDefault()
        if (!newEmployeeName || !newEmployeeEmail) {
            setError('Name and Email are required')
            console.log('Name and Email are required')
            return
        }

        if (newEmployeePhone) {
            if (!newEmployeePhone.includes("+1")) {
                setError('Phone number must start with +1')
                console.log('Phone number must start with +1')
                return
            }
            if (newEmployeePhone.length !== 12) {
                setError('Phone number must be 12 characters long')
                console.log('Phone number must be 12 characters long')
                return
            }
        }

        const { error } = await supabase
            .from('employees')
            .insert([{
                name: newEmployeeName,
                phone: newEmployeePhone,
                email: newEmployeeEmail
            }])

            if (error) {
                console.log('Error adding employee', error)
            } else {
                setNewEmployeeName('')
                setNewEmployeePhone('')
                setNewEmployeeEmail('')

                const {data} = await supabase.from('employees').select('*').order('name')
                setEmployees(data)
            }
    }

    const handleEditEmployee = async (emp) => {
            setEditingEmployee(emp)
            setEditName(emp.name)
            setEditEmail(emp.email)
            setEditPhone(emp.phone)
    }

    const handleDeleteEmployee = async (emp) => {
        const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', emp.id)

        if (error) {
            console.log('Error deleting employee', error)
        } else {
            const {data} = await supabase.from('employees').select('*').order('name')
            setEmployees(data)
        }

    }

    const handleEditSave = async () => {
        const {error} = await supabase
            .from('employees')
            .update({name: editName, email: editEmail, phone: editPhone})
            .eq('id', editingEmployee.id)

        if (error) {
            console.log('Error editing employee', error)
        } else {
            const {data} = await supabase.from('employees').select('*').order('name')
            setEmployees(data)
            setEditingEmployee(null)
        }
    }


    useEffect(() => {
        const fetchEmployees = async () => {
            const { data, error } = await supabase
                .from('employees')
                .select('*')
                .order('name')

            if (error) {
                console.error('Error fetching employees:', error)
                setError(error)
            } else {
                setEmployees(data)
            }
            setLoading(false)
        }
        fetchEmployees()
    }, [])


    if (loading) {
        return <div>Loading Employees...</div>
    }

    return (
        <div className="employeeBody">
            <div className="employeeCard">
                <header>
                    <h2>Active Employees</h2>
                </header>

                <div className="cardBody">
                <div className="employeeAdd">
                    <h3>Add Employee</h3>
                    <form onSubmit={handleAddEmployee}>
                        <input className="employeeName" value={newEmployeeName} type="text" placeholder="Name" onChange={(e) => setNewEmployeeName(e.target.value)} />
                        <input className="employeeEmail" value={newEmployeeEmail} type="email" placeholder="Email (Required)" onChange={(e) => setNewEmployeeEmail(e.target.value)} required />
                        <input className="employeePhone" value={newEmployeePhone} type="tel" placeholder="Phone (+13045551234)" onChange={(e) => setNewEmployeePhone(e.target.value)} />
                        {error && <p className="error">{error}</p>}
                        <button className="employeeAddButton" type="submit">Add Employee</button>
                    </form>
                </div>

                <div className="employees">
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.phone}</td>
                                <td>
                                    <button className="employeeEditButton" onClick={() => handleEditEmployee(emp)}><FaEdit /></button>
                                    <button className="employeeDeleteButton" onClick={() => handleDeleteEmployee(emp)}><IoPersonRemoveSharp /></button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
                </div>

            </div>

            {editingEmployee && (
                <div className="editOverlay">
                    <div className="editCard">
                        <h3>Edit Employee</h3>
                        <input className="editName" value={editName} type="text" placeholder="Name" onChange={(e) => setEditName(e.target.value)} />
                        <input className="editEmail" value={editEmail} type="email" placeholder="Email" onChange={(e) => setEditEmail(e.target.value)} />
                        <input className="editPhone" value={editPhone} type="tel" placeholder="Phone" onChange={(e) => setEditPhone(e.target.value)} />
                        <button className="editButton" onClick={handleEditSave}>Save Changes</button>
                        <button className="editCancelButton" type="button" onClick={() => setEditingEmployee(null)}>Cancel</button>
                    </div>
                </div>
            )}

        </div>


    )
}