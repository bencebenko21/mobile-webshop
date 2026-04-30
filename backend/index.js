require('dotenv').config()
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const port = process.env.PORT

app.use(express.json())  // <--- this line i need to remove or not?
app.use('/api/users', userRoutes)

app.get('/', (req, res) =>{
    res.send('The server is working')
})

app.listen(port, () =>
    {
        console.log("Server running on port "+ port)
})