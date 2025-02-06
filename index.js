const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Configurar el proxy
app.use('/proxy', createProxyMiddleware({
  target: 'https://www.telextrema.com', // Asegúrate de que sea el dominio correcto
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // Elimina el /proxy de la URL
  },
  onProxyRes: (proxyRes, req, res) => {
    // Modificar los encabezados si es necesario
    proxyRes.headers['Content-Type'] = 'video/mp4'; // Ajusta según el tipo de contenido
  },
  selfHandleResponse: true,
  onError: (err, req, res) => {
    console.error('Error en el proxy:', err);
    res.status(500).send('Error en el proxy');
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy corriendo en http://localhost:${port}`);
});
