const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // URL a la que deseas hacer proxy
    changeOrigin: true, // Cambia el origen de la solicitud
    pathRewrite: { '^/proxy': '' }, // Elimina el prefijo '/proxy' de las solicitudes
    selfHandleResponse: true, // Necesario para manejar la respuesta por nosotros mismos
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

            // Si el contenido es HTML, procesamos el HTML
            if (contentType && contentType.includes('text/html')) {
                try {
                    console.log('Procesando HTML...');

                    // Cargamos el HTML usando cheerio para modificarlo
                    const $ = cheerio.load(body);

                    // Evitar modificar el contenido del iframe (video embed)
                    $('iframe').each(function() {
                        const iframeSrc = $(this).attr('src');
                        console.log('Iframe encontrado:', iframeSrc);
                    });

                    // Devolvemos el HTML sin alterar el contenido de los iframes
                    res.setHeader('Content-Type', 'text/html');
                    res.end($.html());
                } catch (error) {
                    console.error('Error al procesar el HTML:', error);
                    res.status(500).send('Error al procesar el contenido HTML');
                }
            } else {
                // Si el contenido es binario (video, imágenes), lo devolvemos tal cual
                console.log('Enviando contenido binario (video, imágenes)...');
                res.setHeader('Content-Type', contentType || 'application/octet-stream');
                res.end(body, 'binary');
            }
        });
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
