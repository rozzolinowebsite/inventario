const express = require('express')
const router = express.Router()
const db = require('../db')

const locationPath = `
  CASE
    WHEN i.caja_id IS NOT NULL THEN
      CONCAT(IFNULL(e.nombre,'?'), IFNULL(CONCAT(' › ', s.nombre),''), ' › ', c.nombre)
    WHEN i.estante_id IS NOT NULL THEN
      CONCAT(e.nombre, ' › ', s.nombre)
    WHEN i.espacio_id IS NOT NULL THEN
      e.nombre
    ELSE '—'
  END AS ubicacion
`

router.get('/', async (req, res) => {
  const conditions = []
  const params = []
  if (req.query.espacio_id) { conditions.push('i.espacio_id=?'); params.push(req.query.espacio_id) }
  if (req.query.estante_id) { conditions.push('i.estante_id=?'); params.push(req.query.estante_id) }
  if (req.query.caja_id) { conditions.push('i.caja_id=?'); params.push(req.query.caja_id) }
  if (req.query.q) { conditions.push('i.nombre LIKE ?'); params.push(`%${req.query.q}%`) }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

  const [rows] = await db.query(`
    SELECT i.*, e.nombre AS espacio_nombre, s.nombre AS estante_nombre, c.nombre AS caja_nombre,
      ${locationPath}
    FROM items i
    LEFT JOIN espacios e ON i.espacio_id = e.id
    LEFT JOIN estantes s ON i.estante_id = s.id
    LEFT JOIN cajas c ON i.caja_id = c.id
    ${where} ORDER BY i.nombre`, params)
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await db.query(`
    SELECT i.*,
      e.nombre AS espacio_nombre, s.nombre AS estante_nombre, c.nombre AS caja_nombre,
      ${locationPath}
    FROM items i
    LEFT JOIN espacios e ON i.espacio_id = e.id
    LEFT JOIN estantes s ON i.estante_id = s.id
    LEFT JOIN cajas c ON i.caja_id = c.id
    WHERE i.id = ?`, [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'Item no encontrado' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  const { nombre, descripcion, cantidad, espacio_id, estante_id, caja_id } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  const [r] = await db.query(
    'INSERT INTO items (nombre, descripcion, cantidad, espacio_id, estante_id, caja_id) VALUES (?,?,?,?,?,?)',
    [nombre, descripcion || null, cantidad != null ? Number(cantidad) : 1, espacio_id || null, estante_id || null, caja_id || null]
  )
  res.json({ id: r.insertId })
})

router.put('/:id', async (req, res) => {
  const { nombre, descripcion, cantidad, espacio_id, estante_id, caja_id } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  await db.query(
    'UPDATE items SET nombre=?, descripcion=?, cantidad=?, espacio_id=?, estante_id=?, caja_id=? WHERE id=?',
    [nombre, descripcion || null, cantidad != null ? Number(cantidad) : 1, espacio_id || null, estante_id || null, caja_id || null, req.params.id]
  )
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM items WHERE id=?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
