import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Home() {
    const [products, setProducts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await api.get('/products')
                setProducts(data.slice(0, 3))
            } catch(err) {
                console.error(err)
            }
        }
        fetchProducts()
    }, [])

    return (
        <div style={{ color: 'white' }}>
            {/* Hero Section */}
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                padding: '6rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    The Latest Mobile Devices
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Discover the newest smartphones from Samsung, Apple, Google and more.
                    Premium devices at competitive prices.
                </p>
                <button onClick={() => navigate('/products')}
                    style={{ padding: '1rem 3rem', backgroundColor: '#e94560', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Shop Now
                </button>
            </div>

            {/* Featured Products */}
            <div style={{ padding: '4rem 2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Products</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                    {products.map(product => (
                        <div key={product.id} onClick={() => navigate(`/products/${product.id}`)}
                            style={{ backgroundColor: '#16213e', borderRadius: '8px', padding: '1.5rem', cursor: 'pointer',
                                transition: 'transform 0.2s', border: '1px solid #0f3460' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{product.brand}</p>
                            <h3 style={{ marginBottom: '0.5rem' }}>{product.product_name}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.line_name}</p>
                            <p style={{ color: '#e94560', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                From ${Math.min(...product.variants.map(v => v.price))}
                            </p>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={() => navigate('/products')}
                        style={{ padding: '0.75rem 2rem', backgroundColor: 'transparent', color: '#e94560',
                            border: '1px solid #e94560', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
                        View All Products
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{ backgroundColor: '#16213e', padding: '2rem', textAlign: 'center', color: '#aaa', borderTop: '1px solid #0f3460' }}>
                <p>© 2026 MobileShop — MSc Project</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Built with React, Node.js, PostgreSQL, Docker</p>
            </div>
        </div>
    )
}