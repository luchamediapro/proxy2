const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // La URL de destino del contenido
    changeOrigin: true, // Cambiar el origen de la solicitud para que no se bloquee
    pathRewrite: { '^/proxy': '' }, // Reescribir la URL eliminando '/proxy'
    selfHandleResponse: false, // No modificar la respuesta por defecto
    onProxyRes: (proxyRes, req, res) => {
        const contentType = proxyRes.headers['content-type'];

        let body = '';
        proxyRes.on('data', chunk => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            if (contentType && contentType.includes('html')) {
                // Eliminar iframes de anuncios
                body = body.replace(/<iframe[^>]*>.*?<\/iframe>/g, ''); 
                body = body.replace(/<script[^>]*src=".*?ads.*?".*?<\/script>/g, ''); // Eliminar scripts de anuncios
                body = body.replace(/<script[^>]*src=".*?advertisement.*?".*?<\/script>/g, ''); // Otro patrón para anuncios

                // Otros scripts relacionados con la publicidad, por ejemplo:
                body = body.replace(/<script[^>]*src=".*?track.*?".*?<\/script>/g, '');
                body = body.replace(/<script[^>]*src=".*?banner.*?".*?<\/script>/g, '');
                
                res.setHeader('Content-Type', 'text/html'); // Establecemos el tipo de contenido
                res.end(body);  // Enviamos la respuesta filtrada
            } else {
                // Si es video, lo dejamos pasar sin modificaciones
                res.setHeader('Content-Type', contentType);
                res.end(body);  // Enviamos el video tal cual
            }
        });
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
