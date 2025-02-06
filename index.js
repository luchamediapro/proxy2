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

            // Si el contenido es HTML, procesamos y modificamos solo el HTML
            if (contentType && contentType.includes('text/html')) {
                try {
                    console.log('Procesando HTML...');
                    const $ = cheerio.load(body);

                    // Asegurémonos de que el contenido embed (iframe o video) no se altere
                    // Si el contenido HTML tiene un iframe, lo dejamos tal cual
                    $('iframe').each(function() {
                        const src = $(this).attr('src');
                        console.log('Iframe encontrado:', src);
                        // Aquí podríamos agregar más lógica si queremos manejar específicamente ciertos iframes
                    });

                    // Devolver el HTML sin modificar el iframe (sin ads)
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
