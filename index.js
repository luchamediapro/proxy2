const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configura el proxy sin realizar ninguna modificación
app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // URL de destino para el contenido del video
    changeOrigin: true, // Cambia el origen de la solicitud
    pathRewrite: { '^/proxy': '' }, // Elimina '/proxy' de la URL antes de enviarla
    selfHandleResponse: false, // No proceses la respuesta manualmente (esto es clave)
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
