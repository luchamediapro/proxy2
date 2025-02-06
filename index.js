const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // URL de destino para el contenido del video
    changeOrigin: true, // Cambia el origen de la solicitud
    pathRewrite: { '^/proxy': '' }, // Elimina '/proxy' de la URL antes de enviarla
    selfHandleResponse: true, // Necesitamos manejar las respuestas
    onProxyRes: (proxyRes, req, res) => {
        let body = '';

        // Filtramos las solicitudes de contenido no deseado (como anuncios)
        proxyRes.on('data', chunk => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            // Evitamos modificar contenido binario (como videos) directamente
            const contentType = proxyRes.headers['content-type'];

            if (contentType && contentType.includes('video')) {
                // Si el contenido es video, solo lo pasamos sin cambios
                res.setHeader('Content-Type', contentType);
                res.end(body);
                return;
            }

            // Filtro de publicidad: Buscar y eliminar elementos de publicidad (iframe, script, etc.)
            let modifiedBody = body;
            if (body.includes('<iframe') || body.includes('<script')) {
                // Eliminar iframes y scripts
                modifiedBody = modifiedBody.replace(/<iframe[^>]*>.*?<\/iframe>/g, ''); // Eliminar iframe
                modifiedBody = modifiedBody.replace(/<script[^>]*>.*?<\/script>/g, ''); // Eliminar script
            }

            // Enviar la respuesta modificada al cliente
            res.setHeader('Content-Type', 'text/html');
            res.end(modifiedBody);
        });
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
