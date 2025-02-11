const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Habilita CORS si necesitas cargarlo desde otro dominio

app.get('/proxy', async (req, res) => {
    try {
        const videoUrl = 'URL_DEL_VIDEO_EMBED'; // Reemplázalo con la URL del video embed

        const response = await fetch(videoUrl, {
            headers: {
                'Referer': 'https://sitio-original.com', // Simula que la petición viene del sitio original
                'User-Agent': req.headers['user-agent'] // Mantiene el User-Agent original
            }
        });

        const body = await response.text();

        // Opcional: Reemplazar referencias al dominio original si es necesario
        const modifiedBody = body.replace(/sitio-original\.com/g, 'tudominio.com');

        res.send(modifiedBody);
    } catch (error) {
        console.error('Error al obtener el video:', error);
        res.status(500).send('Error al obtener el video');
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
