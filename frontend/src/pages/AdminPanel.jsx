import { useState, useEffect } from 'react'
import { api } from '../api'

export default function AdminPanel() {
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [activeTab, setActiveTab] = useState('orders')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)
    const [stockInputs, setStockInputs] = useState({})
    const [statusInputs, setStatusInputs] = useState({})

    useEffect(() => {
        async function fetchData() {
            try {
                const [ordersData, productsData] = await Promise.all([
                    api.get('/admin/orders'),
                    api.get('/products')
                ])
                setOrders(ordersData)
                setProducts(productsData)
            } catch(err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    function showMessage(msg) {
        setMessage(msg)
        setTimeout(() => setMessage(null), 3000)
    }

    async function handleStatusUpdate(orderId) {
        const status = statusInputs[orderId]
        if (!status) return
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status })
            const updated = await api.get('/admin/orders')
            setOrders(updated)
            showMessage('Order status updated')
        } catch(err) {
            showMessage(err.message)
        }
    }

    async function handleStockUpdate(variantId) {
        const stock = Number(stockInputs[variantId])
        if (isNaN(stock) || stock < 0) return
        try {
            await api.put(`/admin/stock/${variantId}`, { stock })
            showMessage('Stock updated')
        } catch(err) {
            showMessage(err.message)
        }
    }

    async function handleDeleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return
        try {
            await api.delete(`/admin/products/${productId}`)
            setProducts(products.filter(p => p.id !== productId))
            showMessage('Product deleted')
        } catch(err) {
            showMessage(err.message)
        }
    }

    if (loading) return <p style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading...</p>

    const tabStyle = (tab) => ({
        padding: '0.75rem 2rem',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: activeTab === tab ? '#e94560' : '#16213e',
        color: 'white',
        borderRadius: '4px'
    })

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1>Admin Panel</h1>
            {message && <p style={{ color: '#4caf50', marginBottom: '1rem' }}>{message}</p>}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>Orders</button>
                <button style={tabStyle('products')} onClick={() => setActiveTab('products')}>Products & Stock</button>
            </div>

            {activeTab === 'orders' && (
                <div>
                    <h2>All Orders</h2>
                    {orders.map(order => (
                        <div key={order.id} style={{ backgroundColor: '#16213e', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <p style={{ fontWeight: 'bold' }}>Order #{order.order_number}</p>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{order.first_name} {order.last_name} — {order.email}</p>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{new Date(order.order_date).toLocaleDateString()}</p>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{order.delivery_city}, {order.delivery_street_name}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <select value={statusInputs[order.id] || order.current_status}
                                        onChange={e => setStatusInputs({ ...statusInputs, [order.id]: e.target.value })}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', backgroundColor: '#0f3460', color: 'white' }}>
                                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleStatusUpdate(order.id)}
                                        style={{ padding: '0.5rem 1rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Update
                                    </button>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #0f3460', paddingTop: '1rem' }}>
                                {order.items.map(item => (
                                    <p key={item.order_item_id} style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                        {item.product_name} x{item.quantity} — ${item.price_at_purchase}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'products' && (
                <div>
                    <h2>Products & Stock</h2>
                    {products.map(product => (
                        <div key={product.id} style={{ backgroundColor: '#16213e', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: 'bold' }}>{product.product_name}</p>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{product.brand} — {product.line_name}</p>
                                </div>
                                <button onClick={() => handleDeleteProduct(product.id)}
                                    style={{ padding: '0.5rem 1rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Delete
                                </button>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                {product.variants.map(variant => (
                                    <div key={variant.variant_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.5rem', borderTop: '1px solid #0f3460' }}>
                                        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                            {variant.color} — {variant.size} — {variant.storage} — ${variant.price}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ color: variant.stock > 0 ? '#4caf50' : '#e94560', fontSize: '0.9rem' }}>
                                                Stock: {variant.stock}
                                            </span>
                                            <input type="number" min="0" placeholder="New stock"
                                                value={stockInputs[variant.variant_id] || ''}
                                                onChange={e => setStockInputs({ ...stockInputs, [variant.variant_id]: e.target.value })}
                                                style={{ width: '80px', padding: '0.25rem', borderRadius: '4px', border: 'none', textAlign: 'center' }} />
                                            <button onClick={() => handleStockUpdate(variant.variant_id)}
                                                style={{ padding: '0.25rem 0.75rem', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}