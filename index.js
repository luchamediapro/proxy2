const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const zlib = require('zlib');
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

            // Comprobamos si la respuesta está comprimida
            const encoding = proxyRes.headers['content-encoding'];
            let decodedBody = body;

            if (encoding === 'gzip') {
                zlib.gunzip(Buffer.from(body, 'binary'), (err, decodedBuffer) => {
                    if (err) {
                        res.status(500).send('Error al descomprimir el contenido');
                        return;
                    }
                    decodedBody = decodedBuffer.toString('utf-8');
                    processAndSendResponse(decodedBody, contentType, res);
                });
            } else if (encoding === 'br') {
                zlib.brotliDecompress(Buffer.from(body, 'binary'), (err, decodedBuffer) => {
                    if (err) {
                        res.status(500).send('Error al descomprimir el contenido');
                        return;
                    }
                    decodedBody = decodedBuffer.toString('utf-8');
                    processAndSendResponse(decodedBody, contentType, res);
                });
            } else {
                decodedBody = body; // No está comprimido, lo procesamos directamente
                processAndSendResponse(decodedBody, contentType, res);
            }
        });
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

// Función para procesar el contenido y enviarlo
function processAndSendResponse(decodedBody, contentType, res) {
    if (contentType && contentType.includes('html')) {
        // Limpiar el HTML de anuncios
        decodedBody = decodedBody.replace(/<iframe[^>]*>.*?<\/iframe>/g, '');
        decodedBody = decodedBody.replace(/<script[^>]*src=".*?ads.*?".*?<\/script>/g, '');
        decodedBody = decodedBody.replace(/<script[^>]*src=".*?advertisement.*?".*?<\/script>/g, '');
        decodedBody = decodedBody.replace(/<script[^>]*src=".*?track.*?".*?<\/script>/g, '');
        decodedBody = decodedBody.replace(/<script[^>]*src=".*?banner.*?".*?<\/script>/g, '');
        decodedBody = decodedBody.replace(/<img[^>]*src=".*?ads.*?".*?\/>/g, '');
        decodedBody = decodedBody.replace(/<link[^>]*href=".*?ads.*?".*?\/>/g, '');
        
        res.setHeader('Content-Type', 'text/html');
        res.send(decodedBody);
    } else {
        // Si no es HTML, lo pasamos tal cual (por ejemplo, im
