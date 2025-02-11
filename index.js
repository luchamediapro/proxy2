const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/proxy', async (req, res) => {
    try {
        const url = 'URL_DEL_VIDEO_EMBED'; // Reemplaza con la URL del video
        const response = await fetch(url, {
            headers: {
                'Referer': 'https://sitio-original.com', // Simula que vienes del sitio original
                'User-Agent': req.headers['user-agent'] // Mantiene el User-Agent original
            }
        });

        const body = await response.text();
        res.send(body.replace(/sitio-original\.com/g, 'tudominio.com')); // Opcional, si hay enlaces internos
    } catch (error) {
        res.status(500).send('Error al obtener el video');
    }
});

app.listen(3000, () => console.log('Proxy activo en puerto 3000'));
