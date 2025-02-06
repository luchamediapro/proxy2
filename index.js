const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // La URL de destino del contenido
    changeOrigin: true, // Cambiar el origen de la solicitud para que no se bloquee
    pathRewrite: { '^/proxy': '' }, // Reescribir la URL eliminando '/proxy'
    selfHandleResponse: false, // No modificar la respuesta por defecto
    onProxyRes: (proxyRes, req, res) => {
        // Verificamos si el contenido es video o html
        const contentType = proxyRes.headers['content-type'];

        if (contentType && contentType.includes('video')) {
            // Si es video, pasamos el contenido tal cual
            res.setHeader('Content-Type', contentType);
            proxyRes.pipe(res);
        } else {
            let body = '';
            proxyRes.on('data', chunk => {
                body += chunk;
            });

            proxyRes.on('end', () => {
                // Si es HTML, eliminamos elementos relacionados con publicidad
                body = body.replace(/<iframe[^>]*>.*?<\/iframe>/g, ''); // Eliminar iframe
                body = body.replace(/<script[^>]*src=".*?ads.*?".*?<\/script>/g, ''); // Eliminar scripts de anuncios
                body = body.replace(/<script[^>]*src=".*?advertisement.*?".*?<\/script>/g, ''); // Otra forma de bloquear anuncios

                res.setHeader('Content-Type', 'text/html'); // Establecemos el tipo de contenido
                res.end(body);  // Enviamos la respuesta filtrada
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
