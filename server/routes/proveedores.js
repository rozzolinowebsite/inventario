const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM proveedores ORDER BY nombre')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { nombre, contacto, telefono, email } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  const [result] = await db.query(
    'INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES (?,?,?,?)',
    [nombre, contacto || null, telefono || null, email || null]
  )
  res.json({ id: result.insertId })
})

router.put('/:id', async (req, res) => {
  const { nombre, contacto, telefono, email } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  await db.query(
    'UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=? WHERE id=?',
    [nombre, contacto || null, telefono || null, email || null, req.params.id]
  )
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM proveedores WHERE id=?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
