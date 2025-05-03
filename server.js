import express from 'express';
import cors from 'cors';
import { rateLimiter } from './rate_limit.js';
import { createShortUrl, getUrl, getIdByUrl } from './utils.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/short/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const url = await getUrl(id);
        if (!url) {
            return res.status(404).send('<h1>404 - URL Not Found</h1>');
        }
        res.redirect(url);
    } catch (err) {
        res.status(500).send(`<h1>Error: ${err.message}</h1>`);
    }
});

app.post('/create', async (req, res) => {
    try {
        const url = req.body.url || req.query.url;
        if (!url || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(url)) {
            return res.status(400).send('<h1>Invalid URL</h1>');
        }

        const existingId = await getIdByUrl(url);
        if (existingId) {
            return res.status(200).json({ shortId: existingId, shortUrl: `http://localhost:${port}/short/${existingId}` });
        }

        const newId = await createShortUrl(url);
        res.status(201).json({ shortId: newId, shortUrl: `http://localhost:${port}/short/${newId}` });
    } catch (err) {
        res.status(500).send(`<h1>Error: ${err.message}</h1>`);
    }
});

app.listen(port, () => {
    console.log(`URL Shortener app listening on port ${port}`);
});