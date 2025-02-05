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

        // Al finalizar la respuesta
        proxyRes.on('end', () => {
            const contentType = proxyRes.headers['content-type'];
            console.log("Content-Type:", contentType);  // Ver el tipo de contenido

            // Si es HTML, procesamos y removemos anuncios
            if (contentType && contentType.includes('text/html')) {
                try {
                    console.log('Procesando HTML...');
                    const $ = cheerio.load(body);

                    // Eliminar anuncios (ajustar según sea necesario)
                    $('iframe[src*="ads"], script[src*="ads"], img[src*="ads"]').remove();

                    // Devolver el HTML modificado
                    res.setHeader('Content-Type', 'text/html');
                    res.end($.html());
                } catch (error) {
                    console.error('Error al procesar el HTML:', error);
                    res.status(500).send('Error al procesar el contenido HTML');
                }
            } else {
                // Si es un archivo binario (video, imagen), lo pasamos sin modificar
                console.log('Enviando contenido binario...');
                res.setHeader('Content-Type', contentType || 'application/octet-stream');
                res.end(body);
            }
        });
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
