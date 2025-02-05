const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio');
const app = express();

app.use('/proxy', createProxyMiddleware({
    target: 'https://tarjetarojaenvivo.lat',
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
    selfHandleResponse: true,
    onProxyRes: function (proxyRes, req, res) {
        let body = '';

        proxyRes.on('data', chunk => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            const $ = cheerio.load(body);
            $('iframe[src*="ads"], script[src*="ads"], img[src*="ads"]').remove();
            res.setHeader('Content-Type', 'text/html');
            res.end($.html());
        });
    }
}));

app.listen(3000, () => console.log('Proxy corriendo en http://localhost:3000'));
