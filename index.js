const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar la ruta '/proxy/*'
app.get('/proxy/*', async (req, res) => {
  const targetUrl = 'https://tarjetarojaenvivo.lat/player/' + req.params[0];
  console.log(`Redirigiendo a: ${targetUrl}`);  // Verifica la URL que estás redirigiendo

  try {
    const response = await axios.get(targetUrl, {
      responseType: 'stream'  // Especifica que esperamos un stream (para contenido multimedia)
    });

    console.log(`Estado de la respuesta: ${response.status}`); // Imprime el estado de la respuesta HTTP

    // Establecer encabezados de respuesta (ajusta el tipo según sea necesario)
    res.setHeader('Content-Type', 'video/mp4');  // Esto puede variar dependiendo del tipo de contenido

    // Pipe de la respuesta al cliente
    response.data.pipe(res); 
  } catch (error) {
    console.error('Error al obtener el contenido:', error);  // Muestra el error detallado
    res.status(500).send('Error al obtener el contenido.');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está en ejecución en el puerto ${port}`);
});
