const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api-token', (req, res) => {
    res.json({ token: "TuTokenGeneradoAquí" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
