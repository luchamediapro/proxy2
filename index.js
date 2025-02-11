const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para permitir peticiones desde otros dominios
app.use(cors());

app.get('/proxy', async (req, res) => {
    try {
        const videoUrl = 'URL_DEL_VIDEO_EMBED'; // 🔴 Reemplázalo con la URL real del embed

        const response = await fetch(videoUrl, {
            headers: {
                'Referer': 'https://sitio-original.com', // 🔴 Cambia esto al sitio original del embed
                'User-Agent': req.headers['user-agent'] // Mantiene el User-Agent del cliente
            }
        });

        const body = await response.text();

        // Opcional: Si el embed tiene enlaces internos bloqueados, puedes reemplazar su dominio
        const modifiedBody = body.replace(/sitio-original\.com/g, 'tudominio.com');

        res.send(modifiedBody);
    } catch (error) {
        console.error('❌ Error al obtener el video:', error);
        res.status(500).send('Error al obtener el video');
    }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
