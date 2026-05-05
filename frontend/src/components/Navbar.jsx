import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#1a1a2e', color: 'white' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                📱 MobileShop
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link>
                {user ? (
                    <>
                        <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart</Link>
                        <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>Orders</Link>
                        {user.assigned_role === 'admin' && (
                            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
                        )}
                        <span style={{ color: '#aaa' }}>Hi, {user.first_name}</span>
                        <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '0.4rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#e94560', color: 'white' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                )}
            </div>
        </nav>
    )
}