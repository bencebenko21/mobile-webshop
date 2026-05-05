import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Cart() {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCart()
    }, [])

    async function fetchCart() {
        try {
            const data = await api.get('/cart')
            setCart(data)
        } catch(err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleRemove(itemId) {
        try {
            await api.delete(`/cart/items/${itemId}`)
            fetchCart()
        } catch(err) {
            console.error(err)
        }
    }

    async function handleQuantityChange(itemId, quantity) {
        if (quantity < 1) return
        try {
            await api.put(`/cart/items/${itemId}`, { quantity })
            fetchCart()
        } catch(err) {
            console.error(err)
        }
    }

    if (loading) return <p style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading...</p>

    const items = cart?.items || []
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Your Cart</h1>
            {items.length === 0 ? (
                <p style={{ color: '#aaa' }}>Your cart is empty.</p>
            ) : (
                <>
                    {items.map(item => (
                        <div key={item.cart_item_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            backgroundColor: '#16213e', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>{item.product_name}</p>
                                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{item.color} — {item.size} — {item.storage}</p>
                                <p style={{ color: '#e94560' }}>${item.price}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#1a1a2e', color: 'white', border: '1px solid #aaa', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#1a1a2e', color: 'white', border: '1px solid #aaa', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                                <button onClick={() => handleRemove(item.cart_item_id)}
                                    style={{ padding: '0.25rem 0.75rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' }}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</p>
                        <button onClick={() => navigate('/checkout')}
                            style={{ marginTop: '1rem', padding: '0.75rem 2rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}