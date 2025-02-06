const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const targetUrl = 'https://www.telextrema.com/myr21Fs85fvd/foxsportspremium.php'; // URL del video

// Proxy para evitar redirección y manejar la respuesta
app.use('/proxy', createProxyMiddleware({
    target: targetUrl, // URL de destino del video
    changeOrigin: true, // Cambia el origen de la solicitud
    pathRewrite: { '^/proxy': '' }, // Reescribe la ruta
    selfHandleResponse: true, // No permite que el proxy maneje la respuesta automáticamente
    onProxyRes: (proxyRes, req, res) => {
        let data = '';

        // Escucha los datos de la respuesta
        proxyRes.on('data', chunk => {
            data += chunk;
        });

        // Cuando los datos son completamente recibidos
        proxyRes.on('end', () => {
            // Aquí puedes modificar la respuesta si es necesario
            // Por ejemplo, podrías filtrar anuncios o cualquier otro contenido no deseado

            // Finalmente, responde al cliente con los datos del video
            res.send(data);
        });
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
