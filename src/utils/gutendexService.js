const GUTENDEX_API = 'https://gutendex.com/books';

async function fetchJson(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Request failed ${resp.status}`);
  return await resp.json();
}

function pickBestFormat(formats) {
  if (!formats) return null;
  const order = [
    'text/html; charset=utf-8',
    'text/html',
    'text/plain; charset=utf-8',
    'text/plain',
    'application/epub+zip',
    'application/pdf',
  ];
  for (const key of order) {
    if (formats[key]) return { mime: key, url: formats[key] };
  }
  const htmlKey = Object.keys(formats).find(k => k.startsWith('text/html'));
  if (htmlKey) return { mime: htmlKey, url: formats[htmlKey] };
  const anyKey = Object.keys(formats).find(k => /^https?:\/\//.test(formats[k] || ''));
  if (anyKey) return { mime: anyKey, url: formats[anyKey] };
  return null;
}

export const GutendexService = {
  async searchBooks(query) {
    const q = encodeURIComponent(query.trim());
    const url = `${GUTENDEX_API}/?search=${q}`;
    const data = await fetchJson(url);
    const results = data?.results || [];
    return results.map(b => {
      const best = pickBestFormat(b.formats);
      const coverImage = b.formats?.['image/jpeg'] || null;
      const author = b.authors?.[0]?.name || 'Unknown';
      const wordCount = b?.download_count ? undefined : undefined; // Gutendex does not provide word_count
      return {
        gutenbergId: b.id,
        title: b.title,
        author,
        coverImage,
        readUrl: best?.url || null,
        readMime: best?.mime || null,
        // We'll estimate totalPages later; Gutendex doesn't give word counts reliably
      };
    });
  },
};

export default GutendexService;


