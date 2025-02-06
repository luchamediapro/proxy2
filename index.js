const express = require('express');
const axios = require('axios');  // Usamos axios en lugar de request
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());

// Middleware para manejar la ruta '/proxy/*'
app.get('/proxy/*', async (req, res) => {
  try {
    const targetUrl = 'https://www.telextrema.com/myr21Fs85fvd/foxsportspremium.php';
    console.log(`Fetching content from: ${targetUrl}`);
    
    // Usamos axios para obtener los datos
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'  // Para evitar bloqueos de User-Agent
      }
    });
    
    // Enviamos la respuesta al cliente
    res.set('Content-Type', 'text/html');
    res.send(response.data);  // Mandamos el HTML de la respuesta
  } catch (err) {
    console.error('Error en el proxy:', err);
    res.status(500).send('Error en el proxy');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
