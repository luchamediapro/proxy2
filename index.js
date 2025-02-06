const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// Permitir CORS
app.use(cors());

// Configurar proxy
app.use('/proxy', createProxyMiddleware({
    target: 'https://www.telextrema.com',
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '', // Elimina la parte "/proxy" de la URL
    },
    onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        res.status(500).send('Error en el proxy');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
