const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat',
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
    selfHandleResponse: true,
    onProxyRes: function (proxyRes, req, res) {
        let body = '';

        // Captura los datos de la respuesta
        proxyRes.on('data', chunk => {
            body += chunk;
        });

        // Al terminar la respuesta, manipula el HTML
        proxyRes.on('end', () => {
            try {
                const $ = cheerio.load(body);

                // Eliminar anuncios
                $('iframe[src*="ads"], script[src*="ads"], img[src*="ads"]').remove();

                // Responde con el HTML modificado
                res.setHeader('Content-Type', 'text/html');
                res.end($.html());
            } catch (error) {
                console.error('Error al procesar el HTML:', error);
                res.status(500).send('Error al procesar el contenido');
            }
        });
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));

