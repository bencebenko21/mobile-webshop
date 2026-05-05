import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        deliveryZipCode: user?.zip_code || '',
        deliveryCity: user?.city || '',
        deliveryStreetName: user?.street_name || '',
        deliveryFloorFlat: user?.floor_flat || ''
    })

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        try {
            await api.post('/orders', {
                deliveryZipCode: Number(form.deliveryZipCode),
                deliveryCity: form.deliveryCity,
                deliveryStreetName: form.deliveryStreetName,
                deliveryFloorFlat: form.deliveryFloorFlat || null
            })
            navigate('/order-complete')
        } catch(err) {
            setError(err.message)
        }
    }

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Checkout</h1>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>Enter your delivery address</p>
            {error && <p style={{ color: '#e94560' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name="deliveryZipCode" placeholder="ZIP Code" value={form.deliveryZipCode} onChange={handleChange} required
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                <input name="deliveryCity" placeholder="City" value={form.deliveryCity} onChange={handleChange} required
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                <input name="deliveryStreetName" placeholder="Street Name" value={form.deliveryStreetName} onChange={handleChange} required
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                <input name="deliveryFloorFlat" placeholder="Floor/Flat (optional)" value={form.deliveryFloorFlat} onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                <button type="submit"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
                    Place Order
                </button>
            </form>
        </div>
    )
}