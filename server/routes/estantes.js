const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const where = req.query.espacio_id ? 'WHERE s.espacio_id=?' : ''
  const params = req.query.espacio_id ? [req.query.espacio_id] : []
  const [rows] = await db.query(`
    SELECT s.*, e.nombre AS espacio_nombre,
      (SELECT COUNT(*) FROM items WHERE estante_id = s.id) AS total_items,
      (SELECT COUNT(*) FROM cajas WHERE estante_id = s.id) AS total_cajas
    FROM estantes s JOIN espacios e ON s.espacio_id = e.id
    ${where} ORDER BY e.nombre, s.nombre`, params)
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [[estante]] = await db.query(`
    SELECT s.*, e.nombre AS espacio_nombre,
      (SELECT COUNT(*) FROM items WHERE estante_id = s.id) AS total_items,
      (SELECT COUNT(*) FROM cajas WHERE estante_id = s.id) AS total_cajas
    FROM estantes s JOIN espacios e ON s.espacio_id = e.id
    WHERE s.id = ?`, [req.params.id])
  if (!estante) return res.status(404).json({ error: 'Estante no encontrado' })

  const [cajas] = await db.query(`
    SELECT c.*,
      (SELECT COUNT(*) FROM items WHERE caja_id = c.id) AS total_items
    FROM cajas c WHERE c.estante_id = ? ORDER BY c.nombre`, [req.params.id])

  const [items] = await db.query(`
    SELECT i.*, c.nombre AS caja_nombre
    FROM items i
    LEFT JOIN cajas c ON i.caja_id = c.id
    WHERE i.estante_id = ? ORDER BY i.nombre`, [req.params.id])

  res.json({ estante, cajas, items })
})

router.post('/', async (req, res) => {
  const { nombre, descripcion, espacio_id } = req.body
  if (!nombre || !espacio_id) return res.status(400).json({ error: 'Nombre y espacio son requeridos' })
  const [r] = await db.query('INSERT INTO estantes (nombre, descripcion, espacio_id) VALUES (?,?,?)', [nombre, descripcion || null, espacio_id])
  res.json({ id: r.insertId })
})

router.put('/:id', async (req, res) => {
  const { nombre, descripcion, espacio_id } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  await db.query('UPDATE estantes SET nombre=?, descripcion=?, espacio_id=? WHERE id=?', [nombre, descripcion || null, espacio_id, req.params.id])
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM estantes WHERE id=?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
