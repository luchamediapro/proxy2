const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const cors = require('cors'); // Para habilitar CORS
app.use(cors());

// Configura el proxy para la URL del video
app.use('/proxy', createProxyMiddleware({
  target: 'https://www.telextrema.com', // Cambia a la URL del video
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // Elimina "/proxy" de la URL
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxy request to: ${req.url}`);
    
    // Agregar las cabeceras necesarias
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
    proxyReq.setHeader('Accept', 'video/mp4'); // Establecer tipo de contenido correcto
    proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
    proxyReq.setHeader('Connection', 'keep-alive');
    proxyReq.setHeader('Referer', 'https://www.telextrema.com'); // Algunas páginas requieren esta cabecera
    proxyReq.setHeader('Origin', 'https://www.telextrema.com');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from ${req.url}: ${proxyRes.statusCode}`);
    
    // Asegurarse de que el tipo de contenido sea correcto
    proxyRes.headers['Content-Type'] = 'video/mp4'; // O el tipo de contenido adecuado
  },
  selfHandleResponse: false,
  onError: (err, req, res) => {
    console.error('Error en el proxy:', err);
    res.status(500).send('Error en el proxy');
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy corriendo en http://localhost:${port}`);
});
