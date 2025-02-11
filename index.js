const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/proxy', async (req, res) => {
    const url = 'URL_DEL_VIDEO_EMBED';
    const response = await fetch(url, {
        headers: {
            'Referer': 'https://sitio-original.com', // Simular el referer del sitio original
            'User-Agent': req.headers['user-agent'] // Mantener el User-Agent original
        }
    });

    const body = await response.text();
    res.send(body.replace(/sitio-original\.com/g, 'tudominio.com'));
});

app.listen(3000, () => console.log('Proxy activo en puerto 3000'));
