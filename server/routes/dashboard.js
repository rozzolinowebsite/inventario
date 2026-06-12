const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const [[{ espacios }]] = await db.query('SELECT COUNT(*) AS espacios FROM espacios')
  const [[{ estantes }]] = await db.query('SELECT COUNT(*) AS estantes FROM estantes')
  const [[{ cajas }]] = await db.query('SELECT COUNT(*) AS cajas FROM cajas')
  const [[{ items }]] = await db.query('SELECT COUNT(*) AS items FROM items')

  const locationCase = `
    CASE
      WHEN i.caja_id IS NOT NULL THEN CONCAT(IFNULL(e.nombre,''), IFNULL(CONCAT(' › ', s.nombre),''), ' › ', c.nombre)
      WHEN i.estante_id IS NOT NULL THEN CONCAT(e.nombre, ' › ', s.nombre)
      WHEN i.espacio_id IS NOT NULL THEN e.nombre
      ELSE '—'
    END AS ubicacion
  `

  const [recientes] = await db.query(`
    SELECT i.id, i.nombre, i.cantidad, i.created_at, ${locationCase}
    FROM items i
    LEFT JOIN espacios e ON i.espacio_id = e.id
    LEFT JOIN estantes s ON i.estante_id = s.id
    LEFT JOIN cajas c ON i.caja_id = c.id
    ORDER BY i.created_at DESC LIMIT 5
  `)

  const [sin_stock] = await db.query(`
    SELECT i.id, i.nombre, ${locationCase}
    FROM items i
    LEFT JOIN espacios e ON i.espacio_id = e.id
    LEFT JOIN estantes s ON i.estante_id = s.id
    LEFT JOIN cajas c ON i.caja_id = c.id
    WHERE i.cantidad = 0
    ORDER BY i.nombre
  `)

  res.json({ espacios, estantes, cajas, items, recientes, sin_stock })
})

module.exports = router
