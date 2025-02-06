const express = require('express');
const request = require('request');
const app = express();

// Middleware para manejar la ruta '/proxy/*'
app.get('/proxy/*', (req, res) => {
  const targetUrl = 'https://www.telextrema.com/myr21Fs85fvd/foxsportspremium.php'; // Aquí ponemos la URL que nos proporcionaste
  console.log(`Redirigiendo a: ${targetUrl}`);

  // Realizamos la solicitud al servidor original
  request(targetUrl, (error, response, body) => {
    if (error) {
      res.status(500).send('Error en el proxy');
      return;
    }

    // Modificamos la respuesta antes de enviarla al cliente (si es necesario)
    let modifiedBody = body;

    // Aquí puedes aplicar modificaciones a `modifiedBody`, como:
    // 1. Eliminar scripts de anuncios
    // 2. Cambiar links a otros contenidos
    // 3. Eliminar ciertos elementos HTML relacionados con anuncios

    // Ejemplo de eliminar bloques de publicidad (si la estructura de HTML lo permite)
    modifiedBody = modifiedBody.replace(/<div class="ads.*?<\/div>/g, ''); // Esto eliminaría los bloques con clase "ads"

    // Finalmente, enviamos el contenido modificado
    res.send(modifiedBody);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy corriendo en http://localhost:${port}`));
