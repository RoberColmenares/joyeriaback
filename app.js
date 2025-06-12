require("dotenv").config();
const express = require("express");
const cors = require("cors");
const carritoRoutes = require('./routes/carritoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api", authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/carrito', carritoRoutes);


module.exports = app;