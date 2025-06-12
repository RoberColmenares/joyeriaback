const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByCorreo, createUser, getUserById, CreatePublicacion, getAllProducts, getProductosPorCategoria,  } = require("../models/userModel");
const userModel = require("../models/userModel");

const register = async (req, res) => {
  const { correo, password, nombre, apellido } = req.body;
  const existing = await getUserByCorreo(correo);
  if (existing) return res.status(400).json({ message: "Usuario ya existe" });

  const hash = await bcrypt.hash(password, 10);
  const user = await createUser(correo, hash, nombre, apellido);
  res.status(201).json({ message: "Usuario registrado", user });
};

const login = async (req, res) => {
  const { correo, password } = req.body;
  const user = await getUserByCorreo(correo);
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign({ id: user.id, correo: user.correo }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

   res.json({
    token,
    user: {
      
      nombre: user.nombre,
      correo: user.correo,
      fecha_registro: user.fecha_registro,
    }
  });
};

const getPerfil =async (req, res) => {

  try {
    const { id } = req.user; // Obtener el ID del usuario desde el token
    const user = await getUserById(id); // Obtener datos completos del usuario

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Excluir campos sensibles como la contraseña
    const { password, ...userData } = user;

    res.json({ usuario: userData });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
}

const handleCrearPublicacion = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipo_prenda,
      tipo_metal,
      talla,
      color,
      precio,
      stok
    } = req.body;

    const usuario_id = req.user.id; // desde el token JWT
    const imagen = req.file ? req.file.filename : null;

    if (!nombre || !precio || !stok) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevoProducto = await CreatePublicacion({
      nombre,
      descripcion,
      tipo_prenda,
      tipo_metal,
      talla,
      color,
      precio,
      stok,
      imagen,
      usuario_id
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};

const obtenerProductos = async (req, res) => {
  try {
    const productos = await getAllProducts();
    res.json(productos);
  } catch (error) {
    console.error('Error en obtenerProductos:', error);  // Aquí imprimimos el error en consola
    res.status(500).json({ 
      message: 'Error al obtener productos',
      error: error.message  // Mandamos el mensaje de error para que puedas verlo en Postman o frontend
    });
  }
};

const obtenerProductosPorCategoria = async (req, res) => {
  const { categoria } = req.params;
  try {
    const productos = await getProductosPorCategoria(categoria);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const GetProductosPorUsuario = async (req, res) => {
  try {
    const userId = req.user.id;
    const productos = await userModel.obtenerProductosPorUsuario(userId);
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos del usuario:", error);
    res.status(500).json({ message: "Error al obtener productos del usuario" });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const eliminado = await userModel.eliminarProductoPorUsuario(id, userId);
    if (!eliminado) return res.status(404).json({ message: "Producto no encontrado o no autorizado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};

const editarProducto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const datosActualizar = req.body; // recibe los campos que quiere actualizar

    const productoActualizado = await userModel.actualizarProductoPorUsuario(id, userId, datosActualizar);
    if (!productoActualizado) return res.status(404).json({ message: "Producto no encontrado o no autorizado" });

    res.json({ message: "Producto actualizado correctamente", producto: productoActualizado });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};





module.exports = { 
  register, 
  login, 
  getPerfil, 
  handleCrearPublicacion,  
  obtenerProductos, 
  obtenerProductosPorCategoria,  
  GetProductosPorUsuario, 
  eliminarProducto,
  editarProducto
  };
