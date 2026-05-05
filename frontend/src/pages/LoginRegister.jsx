import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', password: ''
    })
    const { login } = useAuth()
    const navigate = useNavigate()

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        try {
            if (isLogin) {
                const data = await api.post('/users/login', {
                    email: form.email,
                    password: form.password
                })
                login(data.user, data.token)
                navigate('/')
            } else {
                const data = await api.post('/users/register', {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password
                })
                const loginData = await api.post('/users/login', {
                    email: form.email,
                    password: form.password
                })
                login(loginData.user, loginData.token)
                navigate('/')
            }
        } catch(err) {
            setError(err.message)
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1a1a2e', borderRadius: '8px', color: 'white' }}>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {error && <p style={{ color: '#e94560' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                    </>
                )}
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#aaa' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#e94560', cursor: 'pointer' }}>
                    {isLogin ? 'Register' : 'Login'}
                </span>
            </p>
        </div>
    )
}