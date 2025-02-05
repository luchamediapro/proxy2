const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio'); // Si vas a usar cheerio para manipular HTML
const app = express();

// Configurar el middleware de proxy
app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // URL que estás proxyando
    changeOrigin: true, // Cambia el origen para evitar problemas de CORS
    pathRewrite: { '^/proxy': '' }, // Reescribe la URL de la solicitud
    selfHandleResponse: true, // Permite manejar la respuesta antes de enviarla al cliente
    onProxyRes: function (proxyRes, req, res) {
        let body = '';

        // Capturamos los datos de la respuesta del proxy
        proxyRes.on('data', chunk => {
            body += chunk;
        });

        // Al final de la respuesta, procesamos el contenido
        proxyRes.on('end', () => {
            // Manipulamos el contenido HTML si es necesario
            const $ = cheerio.load(body);

            // Eliminar elementos de anuncios (por ejemplo, iframes, img o script con "ads" en su URL)
            $('iframe[src*="ads"], script[src*="ads"], img[src*="ads"]').remove();

            // Enviar la respuesta filtrada al cliente
            res.setHeader('Content-Type', 'text/html');
            res.end($.html()); // Devuelve el HTML modificado
        });
    }
}));

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => console.log('Proxy corriendo en http://localhost:3000'));
