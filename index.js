const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Configuración del proxy
app.use('/proxy', createProxyMiddleware({
  target: 'https://www.telextrema.com', // El dominio de destino
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // Elimina "/proxy" de la URL
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxy request to: ${req.url}`);
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
    proxyReq.setHeader('Accept', 'video/mp4'); // Asegúrate de que el tipo de contenido es el correcto
    proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
    proxyReq.setHeader('Connection', 'keep-alive');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from ${req.url}: ${proxyRes.statusCode}`);
    
    // Cambia las cabeceras para asegurar que el tipo de contenido es correcto
    proxyRes.headers['Content-Type'] = 'video/mp4'; // Asigna el tipo de contenido adecuado

    // Maneja las redirecciones si es necesario
    if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
      console.log('Redirigiendo a:', proxyRes.headers.location);
    }
  },
  selfHandleResponse: false, // El proxy maneja la respuesta
  onError: (err, req, res) => {
    console.error('Error en el proxy:', err);
    res.status(500).send('Error en el proxy');
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy corriendo en http://localhost:${port}`);
});
