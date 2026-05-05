import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderComplete from './pages/OrderComplete'
import LoginRegister from './pages/LoginRegister'
import OrderHistory from './pages/OrderHistory'
import AdminPanel from './pages/AdminPanel'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
    const { token } = useAuth()
    if (!token) return <Navigate to="/login" />
    return children
}

function AdminRoute({ children }) {
    const { user } = useAuth()
    if (!user || user.assigned_role !== 'admin') return <Navigate to="/" />
    return children
}

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/cart" element={
                    <ProtectedRoute><Cart /></ProtectedRoute>
                } />
                <Route path="/checkout" element={
                    <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/order-complete" element={
                    <ProtectedRoute><OrderComplete /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute><OrderHistory /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute><AdminPanel /></AdminRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}