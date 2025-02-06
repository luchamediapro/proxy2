const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(cors());  // Permitir solicitudes CORS

// Configura la ruta que servirá el video
app.get('/video', async (req, res) => {
    try {
        // URL del video
        const url = 'https://www.telextrema.com/myr21Fs85fvd/foxsportspremium.php';

        // Obtén el HTML de la página del video
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extraer el iframe o el contenido necesario
        const videoEmbedCode = $('iframe').attr('src');

        if (videoEmbedCode) {
            // Redirigir al iframe directamente
            res.send(`
                <html>
                    <body>
                        <iframe src="${videoEmbedCode}" width="800" height="600" frameborder="0" allowfullscreen></iframe>
                    </body>
                </html>
            `);
        } else {
            res.status(404).send('Video no encontrado');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el video');
    }
});

// Inicia el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
