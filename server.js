require("dotenv").config();
const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// Función para generar token
function generarToken() {
    const secret = process.env.SECRET_KEY || "MiClaveSuperSecreta";
    return "?md5=" + crypto.createHash("md5").update(secret).digest("hex");
}

// Ruta para obtener el token
app.get("/api/token", (req, res) => {
    res.json({ token: generarToken() });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
