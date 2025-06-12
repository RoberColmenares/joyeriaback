const express = require("express");
const router = express.Router();
const { register, login, getPerfil, handleCrearPublicacion,  obtenerProductos, obtenerProductosPorCategoria,} = require("../controllers/authController");
const upload = require('../middleware/upload')
const verifyToken = require("../middleware/verifyToken");
const authController = require("../controllers/authController");
const carritoController = require('../controllers/carritoController');


router.post("/register", register);
router.post("/login", login);
router.get('/productos', obtenerProductos);
router.get('/categoria/:categoria', obtenerProductosPorCategoria);

router.get('/perfil', verifyToken, getPerfil);
router.post('/crear-publicacion', verifyToken, upload.single('imagen'), handleCrearPublicacion)
router.get("/productos-usuario",verifyToken, authController.GetProductosPorUsuario);
router.delete("/productos/:id", verifyToken, authController.eliminarProducto);
router.put("/productos/:id", verifyToken, authController.editarProducto);

router.post('/agregar', verifyToken, carritoController.agregarAlCarrito);
router.get('/:usuarioId', verifyToken, carritoController.obtenerCarrito);
router.delete('/item/:itemId', verifyToken, carritoController.eliminarItem);








module.exports = router;