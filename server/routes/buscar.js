const express = require('express')
const router = express.Router()
const db = require('../db')

// Returns all searchable data in one call for client-side fuzzy search
router.get('/', async (req, res) => {
  const [items] = await db.query(`
    SELECT i.id, i.nombre, i.descripcion, i.cantidad,
      CASE
        WHEN i.caja_id IS NOT NULL THEN CONCAT(IFNULL(e.nombre,''), IFNULL(CONCAT(' › ', s.nombre),''), ' › ', c.nombre)
        WHEN i.estante_id IS NOT NULL THEN CONCAT(e.nombre, ' › ', s.nombre)
        WHEN i.espacio_id IS NOT NULL THEN e.nombre
        ELSE ''
      END AS path,
      i.espacio_id, i.estante_id, i.caja_id
    FROM items i
    LEFT JOIN espacios e ON i.espacio_id = e.id
    LEFT JOIN estantes s ON i.estante_id = s.id
    LEFT JOIN cajas c ON i.caja_id = c.id
  `)

  const [cajas] = await db.query(`
    SELECT c.id, c.nombre, c.descripcion,
      CONCAT(IFNULL(e.nombre,''), IFNULL(CONCAT(' › ', s.nombre),'')) AS path,
      c.espacio_id, c.estante_id
    FROM cajas c
    LEFT JOIN espacios e ON c.espacio_id = e.id
    LEFT JOIN estantes s ON c.estante_id = s.id
  `)

  const [estantes] = await db.query(`
    SELECT s.id, s.nombre, s.descripcion, e.nombre AS path, s.espacio_id
    FROM estantes s JOIN espacios e ON s.espacio_id = e.id
  `)

  const [espacios] = await db.query(`SELECT id, nombre, descripcion FROM espacios`)

  const data = [
    ...espacios.map(r => ({ ...r, tipo: 'espacio', path: '' })),
    ...estantes.map(r => ({ ...r, tipo: 'estante' })),
    ...cajas.map(r => ({ ...r, tipo: 'caja' })),
    ...items.map(r => ({ ...r, tipo: 'item' })),
  ]

  res.json(data)
})

module.exports = router
