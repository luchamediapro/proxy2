const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Configuración del proxy para interceptar las solicitudes
app.use('/proxy', createProxyMiddleware({
  target: 'https://www.telextrema.com', // Asegúrate de que el dominio sea correcto
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // Elimina "/proxy" de la URL
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Aquí puedes revisar y modificar los encabezados si es necesario
    console.log(`Response from ${req.url}: ${proxyRes.statusCode}`);
    proxyRes.headers['Content-Type'] = 'video/mp4'; // Ajusta según el tipo de contenido del video
  },
  selfHandleResponse: false, // Deja que el proxy maneje la respuesta
  onError: (err, req, res) => {
    console.error('Error en el proxy:', err);
    res.status(500).send('Error en el proxy');
  }
}));

// Inicializa el servidor en el puerto correspondiente
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy corriendo en http://localhost:${port}`);
});
