app.get('/proxy2/*', async (req, res) => {
    const videoUrl = decodeURIComponent(req.params[0]);

    try {
        const response = await fetch(videoUrl, {
            headers: {
                'Referer': 'https://www.telextrema.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        });

        const body = await response.text();
        const modifiedBody = body.replace(/telextrema\.com/g, 'tudominio.com');

        res.send(modifiedBody);
    } catch (error) {
        console.error('❌ Error al obtener el video:', error);
        res.status(500).send('Error al obtener el video');
    }
});
