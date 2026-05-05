import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [product, setProduct] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await api.get(`/products/${id}`)
                setProduct(data)
                setSelectedVariant(data.variants[0])
            } catch(err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    async function handleAddToCart() {
        if (!user) {
            navigate('/login')
            return
        }
        try {
            await api.post('/cart/items', {
                variantId: selectedVariant.variant_id,
                quantity
            })
            setMessage('Added to cart!')
            setTimeout(() => setMessage(null), 3000)
        } catch(err) {
            setMessage(err.message)
        }
    }

    if (loading) return <p style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading...</p>
    if (!product) return <p style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Product not found</p>

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/products')} style={{ marginBottom: '1rem', background: 'none', border: '1px solid #aaa', color: '#aaa', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                ← Back
            </button>
            <h1>{product.product_name}</h1>
            <p style={{ color: '#aaa' }}>{product.brand} — {product.line_name}</p>
            <p style={{ marginBottom: '2rem' }}>{product.product_description}</p>

            <h3>Select Variant</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {product.variants.map(variant => (
                    <div key={variant.variant_id} onClick={() => setSelectedVariant(variant)}
                        style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', border: '2px solid',
                            borderColor: selectedVariant?.variant_id === variant.variant_id ? '#e94560' : '#16213e',
                            backgroundColor: '#16213e' }}>
                        <p>{variant.color}</p>
                        <p>{variant.size}</p>
                        <p>{variant.storage}</p>
                        <p style={{ color: '#e94560', fontWeight: 'bold' }}>${variant.price}</p>
                        <p style={{ color: variant.stock > 0 ? '#4caf50' : '#e94560', fontSize: '0.85rem' }}>
                            {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                        </p>
                    </div>
                ))}
            </div>

            {selectedVariant && selectedVariant.stock > 0 && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="number" min="1" max={selectedVariant.stock} value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        style={{ width: '60px', padding: '0.5rem', borderRadius: '4px', border: 'none', textAlign: 'center' }} />
                    <button onClick={handleAddToCart}
                        style={{ padding: '0.75rem 2rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
                        Add to Cart
                    </button>
                </div>
            )}
            {message && <p style={{ marginTop: '1rem', color: '#4caf50' }}>{message}</p>}
        </div>
    )
}