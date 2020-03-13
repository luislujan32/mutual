const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3525

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'GET Home route working fine!'
  })
})

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`)
  console.log('Defined routes:')
  console.log('	[GET] http://localhost:3525/')
})
