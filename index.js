const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configura el proxy para redirigir el video desde el enlace proporcionado
app.use('/proxy', createProxyMiddleware({
    target: 'https://la12hd.com/vivo/canal.php?stream=foxsports2mx', // URL de destino
    changeOrigin: true, // Cambia el origen de la solicitud
    pathRewrite: { '^/proxy': '' }, // Elimina '/proxy' de la URL antes de enviarla
    selfHandleResponse: false, // No proceses la respuesta manualmente
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));
g
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
