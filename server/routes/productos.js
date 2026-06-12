const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT p.*, pv.nombre AS proveedor_nombre
    FROM productos p
    LEFT JOIN proveedores pv ON p.proveedor_id = pv.id
    ORDER BY p.nombre
  `)
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { nombre, categoria, stock, stock_minimo, precio, proveedor_id } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  const [result] = await db.query(
    'INSERT INTO productos (nombre, categoria, stock, stock_minimo, precio, proveedor_id) VALUES (?,?,?,?,?,?)',
    [nombre, categoria || null, stock || 0, stock_minimo || 0, precio || null, proveedor_id || null]
  )
  res.json({ id: result.insertId })
})

router.put('/:id', async (req, res) => {
  const { nombre, categoria, stock, stock_minimo, precio, proveedor_id } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
  await db.query(
    'UPDATE productos SET nombre=?, categoria=?, stock=?, stock_minimo=?, precio=?, proveedor_id=? WHERE id=?',
    [nombre, categoria || null, stock || 0, stock_minimo || 0, precio || null, proveedor_id || null, req.params.id]
  )
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM productos WHERE id=?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
