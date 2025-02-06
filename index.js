const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configura el proxy para la ruta /proxy
app.use('/proxy', createProxyMiddleware({
    target: 'https://www.telextrema.com', // URL de destino donde se aloja el video
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' }, // Elimina '/proxy' de la URL antes de enviarla
    selfHandleResponse: false, // Deja que el proxy maneje la respuesta por sí mismo
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.url}`); // Imprime la URL que está siendo redirigida
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err); // Si ocurre un error, se imprime en la consola
        res.status(500).send('Error en el proxy'); // Responde con error 500
    }
}));

// Establece el puerto para el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor proxy corriendo en http://localhost:${port}`);
});
