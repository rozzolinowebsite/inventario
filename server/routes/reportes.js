const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/stock-bajo', async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, nombre, stock, stock_minimo FROM productos WHERE stock <= stock_minimo ORDER BY nombre'
  )
  res.json(rows)
})

router.get('/movimientos-recientes', async (req, res) => {
  const [rows] = await db.query(`
    SELECT m.id, m.fecha, m.tipo, m.cantidad, p.nombre AS producto_nombre
    FROM movimientos m
    JOIN productos p ON m.producto_id = p.id
    ORDER BY m.fecha DESC
    LIMIT 10
  `)
  res.json(rows)
})

module.exports = router
