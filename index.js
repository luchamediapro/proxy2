const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());

// Ruta para el proxy, donde la URL se pasa como parámetro
app.get('/proxy2', async (req, res) => {
    // Obtener la URL del video como parámetro en la query string
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('Error: Falta el parámetro de URL');
    }

    try {
        // Realizar la petición con el URL que pasamos como parámetro
        const response = await fetch(videoUrl, {
            headers: {
                'Referer': 'https://www.telextrema.com',  // Referer para evitar bloqueo
                'User-Agent': req.headers['user-agent'],  // Usar el mismo User-Agent
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        });

        const body = await response.text();
        res.send(body);
    } catch (error) {
        console.error('❌ Error al obtener el video:', error);
        res.status(500).send('Error al obtener el video');
    }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
