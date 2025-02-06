const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // La URL del contenido del reproductor
    changeOrigin: true, // Cambia el origen de la solicitud para evitar bloqueos por CORS
    pathRewrite: { '^/proxy': '' }, // Reescribe la URL, eliminando '/proxy'
    selfHandleResponse: true, // Maneja la respuesta de forma manual para modificarla
    onProxyRes: (proxyRes, req, res) => {
        let body = '';
        proxyRes.on('data', chunk => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            const contentType = proxyRes.headers['content-type'];

            // Solo manipulamos el contenido HTML
            if (contentType && contentType.includes('html')) {
                // Eliminar iframes y scripts relacionados con publicidad
                body = body.replace(/<iframe[^>]*>.*?<\/iframe>/g, ''); // Eliminar todos los iframes
                body = body.replace(/<script[^>]*src=".*?ads.*?".*?<\/script>/g, ''); // Eliminar scripts de anuncios
                body = body.replace(/<script[^>]*src=".*?advertisement.*?".*?<\/script>/g, '');
                body = body.replace(/<script[^>]*src=".*?track.*?".*?<\/script>/g, '');
                body = body.replace(/<script[^>]*src=".*?banner.*?".*?<\/script>/g, '');

                // También se pueden bloquear imágenes o elementos relacionados con anuncios
                body = body.replace(/<img[^>]*src=".*?ads.*?".*?\/>/g, ''); // Eliminar imágenes de anuncios
                body = body.replace(/<link[^>]*href=".*?ads.*?".*?\/>/g, ''); // Eliminar enlaces relacionados con anuncios

                // Mandamos la respuesta modificada
                res.setHeader('Content-Type', 'text/html');
                res.send(body);
            } else {
                // Si el contenido no es HTML, lo pasamos tal cual
                res.setHeader('Content-Type', contentType);
                res.send(body);
            }
        });
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Proxy corriendo en http://localhost:${port}`);
});
