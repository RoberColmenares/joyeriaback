const db = require('../config/db'); // Ajusta la ruta según tu archivo de conexión

const crearCarritoSiNoExiste = async (usuarioId) => {
  const result = await db.query('SELECT id FROM carrito WHERE usuario_id = $1', [usuarioId]);
  if (result.rows.length > 0) return result.rows[0].id;

  const nuevo = await db.query(
    'INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING id',
    [usuarioId]
  );
  return nuevo.rows[0].id;
};

const agregarItemAlCarrito = async (carritoId, productoId, cantidad) => {
  const existe = await db.query(
    'SELECT * FROM carrito_items WHERE carrito_id = $1 AND producto_id = $2',
    [carritoId, productoId]
  );

  if (existe.rows.length > 0) {
    await db.query(
      'UPDATE carrito_items SET cantidad = cantidad + $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE carrito_id = $2 AND producto_id = $3',
      [cantidad, carritoId, productoId]
    );
  } else {
    await db.query(
      'INSERT INTO carrito_items (carrito_id, producto_id, cantidad) VALUES ($1, $2, $3)',
      [carritoId, productoId, cantidad]
    );
  }
};

const obtenerCarritoPorUsuario = async (usuarioId) => {
  const result = await db.query(`
    SELECT ci.id as item_id, p.nombre, p.precio, ci.cantidad, p.imagen
    FROM carrito_items ci
    JOIN carrito c ON ci.carrito_id = c.id
    JOIN productos p ON ci.producto_id = p.id
    WHERE c.usuario_id = $1
  `, [usuarioId]);
  return result.rows;
};

const eliminarItemDelCarrito = async (itemId) => {
  await db.query('DELETE FROM carrito_items WHERE id = $1', [itemId]);
};

module.exports = {
  crearCarritoSiNoExiste,
  agregarItemAlCarrito,
  obtenerCarritoPorUsuario,
  eliminarItemDelCarrito
};
