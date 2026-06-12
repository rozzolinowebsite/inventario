const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const [rows] = await db.query(`
    SELECT m.*, p.nombre AS producto_nombre
    FROM movimientos m
    JOIN productos p ON m.producto_id = p.id
    ORDER BY m.fecha DESC
    LIMIT 100
  `)
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { producto_id, tipo, cantidad, nota } = req.body
  if (!producto_id || !tipo || !cantidad) {
    return res.status(400).json({ error: 'Producto, tipo y cantidad son requeridos' })
  }
  if (!['entrada', 'salida'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' })
  }

  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    await conn.query(
      'INSERT INTO movimientos (producto_id, tipo, cantidad, nota) VALUES (?,?,?,?)',
      [producto_id, tipo, cantidad, nota || null]
    )

    const delta = tipo === 'entrada' ? cantidad : -cantidad
    const [check] = await conn.query('SELECT stock FROM productos WHERE id=?', [producto_id])
    if (tipo === 'salida' && check[0].stock < cantidad) {
      await conn.rollback()
      return res.status(400).json({ error: 'Stock insuficiente' })
    }

    await conn.query('UPDATE productos SET stock = stock + ? WHERE id=?', [delta, producto_id])
    await conn.commit()
    res.json({ ok: true })
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
})

module.exports = router
