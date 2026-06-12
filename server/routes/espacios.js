const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT e.*,
      (SELECT COUNT(*) FROM estantes WHERE espacio_id = e.id) AS total_estantes,
      (SELECT COUNT(*) FROM cajas WHERE espacio_id = e.id) AS total_cajas,
      (SELECT COUNT(*) FROM items WHERE espacio_id = e.id) AS total_items
    FROM espacios e ORDER BY e.nombre
  `)
  res.json(rows)
})

router.get('/:id/detalle', async (req, res) => {
  const { id } = req.params
  const [[espacio]] = await db.query('SELECT * FROM espacios WHERE id=?', [id])
  if (!espacio) return res.status(404).json({ error: 'No encontrado' })

  const [estantes] = await db.query(`
    SELECT s.*, (SELECT COUNT(*) FROM items WHERE estante_id = s.id) AS total_items,
      (SELECT COUNT(*) FROM cajas WHERE estante_id = s.id) AS total_cajas
    FROM estantes s WHERE s.espacio_id=? ORDER BY s.nombre`, [id])

  const [cajas] = await db.query(`
    SELECT c.*, s.nombre AS estante_nombre,
      (SELECT COUNT(*) FROM items WHERE caja_id = c.id) AS total_items
    FROM cajas c LEFT JOIN estantes s ON c.estante_id = s.id
    WHERE c.espacio_id=? ORDER BY c.nombre`, [id])

  const [items] = await db.query(`
    SELECT i.*, s.nombre AS estante_nombre, c.nombre AS caja_nombre
    FROM items i
    LEFT JOIN estantes s ON i.estante_id = s.id
    LEFT JOIN cajas c ON i.caja_id = c.id
    WHERE i.espacio_id=? ORDER BY i.nombre`, [id])

  res.json({ espacio, estantes, cajas, items })
})

router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  const [r] = await db.query('INSERT INTO espacios (nombre, descripcion) VALUES (?,?)', [nombre, descripcion || null])
  res.json({ id: r.insertId })
})

router.put('/:id', async (req, res) => {
  const { nombre, descripcion } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  await db.query('UPDATE espacios SET nombre=?, descripcion=? WHERE id=?', [nombre, descripcion || null, req.params.id])
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM espacios WHERE id=?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
