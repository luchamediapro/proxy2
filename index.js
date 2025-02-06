const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

// Permitir CORS
app.use(cors());

// Configuración del proxy para obtener la página y analizarla
app.get('/proxy/*', async (req, res) => {
  const url = 'https://www.telextrema.com/' + req.params[0];
  
  try {
    // Hacer una solicitud HTTP a la página del video
    const response = await axios.get(url);
    
    // Usar Cheerio para analizar el HTML y extraer la URL m3u8
    const $ = cheerio.load(response.data);
    const videoUrl = $('script').map((i, el) => {
      // Buscar el código JavaScript que contiene la URL m3u8
      const scriptContent = $(el).html();
      const regex = /https?:\/\/[^\s]+\.m3u8/g;
      const matches = scriptContent.match(regex);
      return matches ? matches[0] : null;
    }).get().find(url => url);

    if (videoUrl) {
      res.json({ videoUrl });
    } else {
      res.status(404).json({ error: 'm3u8 URL no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener el video:', error);
    res.status(500).json({ error: 'Error al obtener el video' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
