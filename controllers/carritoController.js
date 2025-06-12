const carritoModel = require('../models/carritoModel');

const agregarAlCarrito = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { productoId, cantidad } = req.body;

    const carritoId = await carritoModel.crearCarritoSiNoExiste(usuarioId);
    await carritoModel.agregarItemAlCarrito(carritoId, productoId, cantidad);

    res.status(200).json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const obtenerCarrito = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const items = await carritoModel.obtenerCarritoPorUsuario(usuarioId);
    res.status(200).json(items);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const eliminarItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    await carritoModel.eliminarItemDelCarrito(itemId);

    res.status(200).json({ mensaje: 'Item eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


module.exports = {
  agregarAlCarrito,
  obtenerCarrito,
  eliminarItem,  // si la tienes implementada
};