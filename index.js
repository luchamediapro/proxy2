const express = require('express');
const app = express();
const request = require('request');
const port = process.env.PORT || 3000;

// Middleware para manejar la ruta '/proxy/*'
app.get('/proxy/*', (req, res) => {
  const targetUrl = 'https://tarjetarojaenvivo.lat/player/' + req.params[0];
  console.log(`Redirecting to: ${targetUrl}`);  // Verifica la URL que estás redirigiendo
  request(targetUrl).pipe(res);  // Redirige la solicitud al sitio del video
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
