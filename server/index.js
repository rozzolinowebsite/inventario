require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/buscar', require('./routes/buscar'))
app.use('/api/espacios', require('./routes/espacios'))
app.use('/api/estantes', require('./routes/estantes'))
app.use('/api/cajas', require('./routes/cajas'))
app.use('/api/items', require('./routes/items'))
app.use('/api/dashboard', require('./routes/dashboard'))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
