const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para permitir peticiones desde otros dominios
app.use(cors());

// Ruta que acepta la URL como parámetro
app.get('/proxy2/*', async (req, res) => {
    const videoUrl = decodeURIComponent(req.params[0]);  // Decodificar la URL que recibimos

    try {
        const response = await fetch(videoUrl, {
            headers: {
                'Referer': 'https://www.telextrema.com',  // El sitio de referencia para que no bloquee
                'User-Agent': req.headers['user-agent']  // Mantiene el User-Agent original
            }
        });

        const body = await response.text();

        // Opcional: Si el embed tiene enlaces internos bloqueados, puedes reemplazar su dominio
        const modifiedBody = body.replace(/telextrema\.com/g, 'tudominio.com');

        res.send(modifiedBody);
    } catch (error) {
        console.error('❌ Error al obtener el video:', error);
        res.status(500).send('Error al obtener el video');
    }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
