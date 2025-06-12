const db = require("../config/db");

const getUserByCorreo = async (correo) => {
  const res = await db.query("SELECT * FROM users WHERE correo = $1", [correo]);
  return res.rows[0];
};

const getUserById = async (id) => {
  const result = await db.query('SELECT id, nombre, apellido, correo, fecha_registro FROM users WHERE id = $1', [id]);
  return result.rows[0];
};


const getAllProducts = async () => {
  const result = await db.query(`
   SELECT 
      p.*, 
      u.nombre AS vendedor_nombre, 
      u.apellido AS vendedor_apellido, 
      u.correo AS vendedor_correo
    FROM productos p
    JOIN users u ON p.usuario_id = u.id
  `);
  return result.rows;
};

const createUser = async (correo, passwordHash, nombre = null, apellido = null) => {
  const res = await db.query(
    "INSERT INTO users (correo, password, nombre, apellido) VALUES ($1, $2, $3, $4) RETURNING *",
    [correo, passwordHash, nombre, apellido]
  );  
  return res.rows[0];
};


const CreatePublicacion = async (producto) => {

  const {    

    nombre,
    descripcion,
    tipo_prenda,
    tipo_metal,
    talla,
    color,
    precio,
    stok,
    imagen,
    usuario_id,

  }= producto

  const result = await db.query(
    `INSERT INTO productos 
     (nombre, descripcion, tipo_prenda, tipo_metal, talla, color, precio, stok, imagen, usuario_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [nombre, descripcion, tipo_prenda, tipo_metal, talla, color, precio, stok, imagen, usuario_id]
  )
  return result.rows[0];

}


const getProductosPorCategoria = async (categoria) => {
  const result = await db.query(
    `SELECT * FROM productos WHERE tipo_prenda ILIKE $1`,
    [categoria]
  );
  return result.rows;
};

const obtenerProductosPorUsuario = async (userId) => {
  const result = await db.query(
    "SELECT * FROM productos WHERE usuario_id = $1",
    [userId]
  );
  return result.rows;
};

const eliminarProductoPorUsuario = async (productoId, userId) => {
  const result = await db.query(
    "DELETE FROM productos WHERE id = $1 AND usuario_id = $2 RETURNING *",
    [productoId, userId]
  );
  return result.rowCount > 0;
};

const actualizarProductoPorUsuario = async (productoId, userId, datosActualizar) => {
  // Construimos el query dinámico para actualizar solo los campos recibidos
  const campos = [];
  const valores = [];
  let idx = 1;

  for (const key in datosActualizar) {
    campos.push(`${key} = $${idx}`);
    valores.push(datosActualizar[key]);
    idx++;
  }

  valores.push(productoId);
  valores.push(userId);

  const query = `UPDATE productos SET ${campos.join(", ")} WHERE id = $${idx} AND usuario_id = $${idx + 1} RETURNING *`;
  
  const result = await db.query(query, valores);
  return result.rows[0]; // devuelve el producto actualizado o undefined si no se encontró
};


module.exports = { 
getUserByCorreo,
createUser, getUserById, 
CreatePublicacion, 
getAllProducts, 
getProductosPorCategoria,  
obtenerProductosPorUsuario, 
eliminarProductoPorUsuario, 
actualizarProductoPorUsuario };