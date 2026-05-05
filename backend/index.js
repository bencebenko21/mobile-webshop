require('dotenv').config()
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cors = require('cors')
const port = process.env.PORT

app.use(cors({ origin: 'http://localhost' }))
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) =>{
    res.send('The server is working')
})

app.listen(port, () =>
    {
        console.log("Server running on port "+ port)
})