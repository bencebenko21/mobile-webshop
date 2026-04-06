require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

app.use(express.json())

app.get('/', (req, res) =>{
    res.send('The server is working')
})

app.listen(port, () =>
    {
        console.log("Server running on port "+ port)
})