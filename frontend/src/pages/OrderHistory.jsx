import { useState, useEffect } from 'react'
import { api } from '../api'

export default function OrderHistory() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await api.get('/orders')
                setOrders(data)
            } catch(err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <p style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading...</p>

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p style={{ color: '#aaa' }}>You have no orders yet.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} style={{ backgroundColor: '#16213e', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>Order #{order.order_number}</p>
                                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{new Date(order.order_date).toLocaleDateString()}</p>
                            </div>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem',
                                backgroundColor: order.current_status === 'delivered' ? '#4caf50' :
                                    order.current_status === 'cancelled' ? '#e94560' : '#ff9800',
                                color: 'white' }}>
                                {order.current_status}
                            </span>
                        </div>
                        <div style={{ borderTop: '1px solid #0f3460', paddingTop: '1rem' }}>
                            {order.items.map(item => (
                                <div key={item.order_item_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>{item.product_name} x{item.quantity}</span>
                                    <span style={{ color: '#e94560' }}>${item.price_at_purchase * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '1rem', borderTop: '1px solid #0f3460', paddingTop: '1rem' }}>
                            <p style={{ fontWeight: 'bold' }}>
                                Total: ${order.items.reduce((sum, item) => sum + item.price_at_purchase * item.quantity, 0).toFixed(2)}
                            </p>
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                {order.delivery_city}, {order.delivery_street_name}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}