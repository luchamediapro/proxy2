const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Configura el proxy
app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat', // URL de destino para el contenido del video
    changeOrigin: true, // Cambia el origen de la solicitud
    pathRewrite: { '^/proxy': '' }, // Elimina '/proxy' de la URL antes de enviarla
    selfHandleResponse: false, // No proceses la respuesta manualmente
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

// Configuración de la política de seguridad de contenido
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'none'; object-src 'none';");
    next();
});

// Rutea a un HTML con iframe que utiliza el proxy
app.get('/video', (req, res) => {
    const iframeHtml = `
        <html>
            <head>
                <title>Video Embed</title>
            </head>
            <body>
                <iframe 
                    src="/proxy/player/1/71"  <!-- Utiliza el proxy para cargar el video -->
                    width="800" 
                    height="600" 
                    sandbox="allow-scripts allow-same-origin"  <!-- Aquí se añade el atributo sandbox -->
                    style="border:none;">
                </iframe>
            </body>
        </html>
    `;
    res.send(iframeHtml);  // Responde con la página HTML que incluye el iframe
});

// Inicia el servidor en el puerto especificado
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
