import { useNavigate } from 'react-router-dom'

export default function OrderComplete() {
    const navigate = useNavigate()

    return (
        <div style={{ padding: '2rem', color: 'white', textAlign: 'center', marginTop: '4rem' }}>
            <h1 style={{ fontSize: '3rem' }}>✅</h1>
            <h2>Order Placed Successfully!</h2>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>Thank you for your purchase. Your order is being processed.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => navigate('/orders')}
                    style={{ padding: '0.75rem 2rem', backgroundColor: '#16213e', color: 'white', border: '1px solid #aaa', borderRadius: '4px', cursor: 'pointer' }}>
                    View Orders
                </button>
                <button onClick={() => navigate('/products')}
                    style={{ padding: '0.75rem 2rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}