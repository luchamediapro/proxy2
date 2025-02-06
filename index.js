const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const iconv = require('iconv-lite');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // URL de destino
    changeOrigin: true, // Cambiar el origen para evitar problemas de CORS
    pathRewrite: { '^/proxy': '' }, // Reescribe la URL para que no sea detectado como proxy
    selfHandleResponse: true, // Nos encargamos de la respuesta
    onProxyRes: (proxyRes, req, res) => {
        let body = '';
        
        // Escuchar la respuesta para manejarla una vez que llega
        proxyRes.on('data', chunk => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            const contentType = proxyRes.headers['content-type'];

            // Detectar si el contenido es HTML o tiene codificación
            if (contentType && contentType.includes('html')) {
                // Si el contenido está en un formato con codificación específica
                let buffer = Buffer.from(body, 'binary');
                let decodedBody = iconv.decode(buffer, 'utf-8'); // Asegúrate de usar la codificación correcta

                // Eliminar iframes y scripts relacionados con anuncios
                decodedBody = decodedBody.replace(/<iframe[^>]*>.*?<\/iframe>/g, '');
                decodedBody = decodedBody.replace(/<script[^>]*src=".*?ads.*?".*?<\/script>/g, '');
                decodedBody = decodedBody.replace(/<script[^>]*src=".*?advertisement.*?".*?<\/script>/g, '');
                decodedBody = decodedBody.replace(/<script[^>]*src=".*?track.*?".*?<\/script>/g, '');
                decodedBody = decodedBody.replace(/<script[^>]*src=".*?banner.*?".*?<\/script>/g, '');

                // Eliminar imágenes de anuncios
                decodedBody = decodedBody.replace(/<img[^>]*src=".*?ads.*?".*?\/>/g, '');
                decodedBody = decodedBody.replace(/<link[^>]*href=".*?ads.*?".*?\/>/g, '');

                // Mandar la respuesta modificada
                res.setHeader('Content-Type', 'text/html');
                res.send(decodedBody);
            } else {
                // Si no es HTML, lo pasamos tal cual (por ejemplo, imágenes o videos)
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
