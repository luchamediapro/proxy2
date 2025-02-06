const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();

// Usar CORS
app.use(cors());

// Configuración del proxy para manejar la ruta de video
app.get('/proxy/*', async (req, res) => {
  const targetUrl = `https://www.telextrema.com/${req.params[0]}`;

  try {
    // Hacemos una solicitud al sitio de video usando Axios
    const response = await axios.get(targetUrl);

    // Procesamos el HTML usando Cheerio
    const $ = cheerio.load(response.data);

    // Aquí se puede ajustar el contenido, si necesitas extraer el enlace directo al video
    // En este caso, buscamos el contenido del iframe o lo que sea necesario
    const videoUrl = $('iframe').attr('src');  // Suponiendo que el video esté en un iframe

    if (videoUrl) {
      // Redirige al iframe de video
      res.redirect(videoUrl);
    } else {
      res.status(404).send('No se pudo encontrar el video');
    }
  } catch (error) {
    console.error('Error al procesar la URL:', error);
    res.status(500).send('Hubo un error al intentar cargar el video.');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
