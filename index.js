const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/proxy/*', async (req, res) => {
    const targetPath = req.params[0];
    const targetUrl = `https://www.telextrema.com/${targetPath}`;

    console.log(`Accediendo a: ${targetUrl}`);

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': 'https://www.telextrema.com/',
                'Origin': 'https://www.telextrema.com',
                'Host': 'www.telextrema.com'
            },
            responseType: 'stream'
        });

        res.set(response.headers);
        response.data.pipe(res);
    } catch (error) {
        console.error('Error en el proxy:', error.message);
        res.status(500).send('No se pudo obtener el contenido');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
