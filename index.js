const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/proxy/*', async (req, res) => {
  const url = 'https://www.telextrema.com/' + req.params[0];
  
  try {
    // Lanza Puppeteer para abrir la página y esperar a que el contenido cargue
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extrae la URL m3u8 utilizando Puppeteer
    const videoUrl = await page.evaluate(() => {
      // Aquí puedes ajustar el selector según la estructura de la página
      const scriptContent = Array.from(document.querySelectorAll('script')).map(script => script.innerHTML).join('');
      const regex = /https?:\/\/[^\s]+\.m3u8/g;
      const matches = scriptContent.match(regex);
      return matches ? matches[0] : null;
    });

    if (videoUrl) {
      res.json({ videoUrl });
    } else {
      res.status(404).json({ error: 'm3u8 URL no encontrada' });
    }

    await browser.close();
  } catch (error) {
    console.error('Error al obtener el video:', error);
    res.status(500).json({ error: 'Error al obtener el video' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
