const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/proxy/*', async (req, res) => {
    const targetUrl = `https://tarjetarojaenvivo.lat/player/${req.params[0]}`;
    console.log(`Redirigiendo a: ${targetUrl}`);

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            responseType: 'stream'
        });

        response.data.pipe(res);
    } catch (error) {
        console.error('Error en el proxy:', error);
        res.status(500).send('Error al obtener el video');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
