// 🖼️ Image Search — Express + Unsplash
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;
const KEY = process.env.UNSPLASH_KEY;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
  const q = (req.query.q || 'nature').trim();
  const page = req.query.page || 1;
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20&page=${page}&client_id=${KEY}`,
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    res.json({
      total: data.total,
      results: data.results.map((p) => ({
        id: p.id,
        url_regular: p.urls.regular,
        url_full: p.urls.full,
        url_small: p.urls.small,
        author: p.user.name,
        author_link: p.user.links.html,
        description: p.alt_description || p.description || '',
        color: p.color,
        download_link: p.links.download_location,
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`\n🖼️  Image Search: http://localhost:${PORT}\n`));
