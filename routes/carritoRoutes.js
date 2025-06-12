// routes/carritoRoutes.js
const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const verifyToken = require('../middleware/verifyToken');

router.post('/agregar', verifyToken, carritoController.agregarAlCarrito);
router.get('/:usuarioId', verifyToken, carritoController.obtenerCarrito);
router.delete('/item/:itemId', verifyToken, carritoController.eliminarItem);

module.exports = router;
