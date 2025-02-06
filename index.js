const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // La URL de destino del contenido
    changeOrigin: true, // Cambiar el origen de la solicitud para que no se bloquee
    pathRewrite: { '^/proxy': '' }, // Reescribir la URL eliminando '/proxy'
    selfHandleResponse: false, // No modificar la respuesta
    onProxyRes: (proxyRes, req, res) => {
        // Verificamos si el contenido es un video
        const contentType = proxyRes.headers['content-type'];

        // Si es video, simplemente lo enviamos tal cual
        if (contentType && contentType.includes('video')) {
            res.setHeader('Content-Type', contentType);
            proxyRes.pipe(res);  // Pasa el contenido directamente sin alterarlo
        } else {
            // Si no es un video, seguimos con el manejo de la respuesta
            let body = '';
            proxyRes.on('data', chunk => {
                body += chunk;
            });

            proxyRes.on('end', () => {
                // Aquí solo eliminamos los elementos no deseados en el contenido HTML
                body = body.replace(/<iframe[^>]*>.*?<\/iframe>/g, ''); // Elimina iframes
                body = body.replace(/<script[^>]*>.*?<\/script>/g, ''); // Elimina scripts de anuncios

                res.setHeader('Content-Type', 'text/html'); // Establecemos el tipo de contenido
                res.end(body);  // Enviamos la respuesta modificada
            });
        }
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
