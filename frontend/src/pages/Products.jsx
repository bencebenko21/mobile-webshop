import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Products() {
    const [products, setProducts] = useState([])
    const [filtered, setFiltered] = useState([])
    const [brands, setBrands] = useState([])
    const [selectedBrand, setSelectedBrand] = useState('All')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await api.get('/products')
                setProducts(data)
                setFiltered(data)
                const uniqueBrands = ['All', ...new Set(data.map(p => p.brand))]
                setBrands(uniqueBrands)
            } catch(err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    function handleFilter(brand) {
        setSelectedBrand(brand)
        if (brand === 'All') {
            setFiltered(products)
        } else {
            setFiltered(products.filter(p => p.brand === brand))
        }
    }

    if (loading) return <p style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading...</p>

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1>Products</h1>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {brands.map(brand => (
                    <button key={brand} onClick={() => handleFilter(brand)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
                            backgroundColor: selectedBrand === brand ? '#e94560' : '#16213e', color: 'white' }}>
                        {brand}
                    </button>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filtered.map(product => (
                    <div key={product.id} onClick={() => navigate(`/products/${product.id}`)}
                        style={{ backgroundColor: '#16213e', borderRadius: '8px', padding: '1.5rem', cursor: 'pointer' }}>
                        <h3>{product.product_name}</h3>
                        <p style={{ color: '#aaa' }}>{product.brand} — {product.line_name}</p>
                        <p style={{ color: '#e94560', fontWeight: 'bold' }}>
                            From ${Math.min(...product.variants.map(v => v.price))}
                        </p>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                            {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}