const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const conditions = []
  const params = []
  if (req.query.espacio_id) { conditions.push('c.espacio_id=?'); params.push(req.query.espacio_id) }
  if (req.query.estante_id) { conditions.push('c.estante_id=?'); params.push(req.query.estante_id) }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

  const [rows] = await db.query(`
    SELECT c.*, e.nombre AS espacio_nombre, s.nombre AS estante_nombre,
      (SELECT COUNT(*) FROM items WHERE caja_id = c.id) AS total_items
    FROM cajas c
    LEFT JOIN espacios e ON c.espacio_id = e.id
    LEFT JOIN estantes s ON c.estante_id = s.id
    ${where} ORDER BY e.nombre, s.nombre, c.nombre`, params)
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [[caja]] = await db.query(`
    SELECT c.*, e.nombre AS espacio_nombre, s.nombre AS estante_nombre,
      (SELECT COUNT(*) FROM items WHERE caja_id = c.id) AS total_items
    FROM cajas c
    LEFT JOIN espacios e ON c.espacio_id = e.id
    LEFT JOIN estantes s ON c.estante_id = s.id
    WHERE c.id = ?`, [req.params.id])
  if (!caja) return res.status(404).json({ error: 'Caja no encontrada' })

  const [items] = await db.query(`
    SELECT i.*
    FROM items i
    WHERE i.caja_id = ? ORDER BY i.nombre`, [req.params.id])

  res.json({ caja, items })
})

router.post('/', async (req, res) => {
  const { nombre, descripcion, espacio_id, estante_id } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  const [r] = await db.query(
    'INSERT INTO cajas (nombre, descripcion, espacio_id, estante_id) VALUES (?,?,?,?)',
    [nombre, descripcion || null, espacio_id || null, estante_id || null]
  )
  res.json({ id: r.insertId })
})

router.put('/:id', async (req, res) => {
  const { nombre, descripcion, espacio_id, estante_id } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  await db.query(
    'UPDATE cajas SET nombre=?, descripcion=?, espacio_id=?, estante_id=? WHERE id=?',
    [nombre, descripcion || null, espacio_id || null, estante_id || null, req.params.id]
  )
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM cajas WHERE id=?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
