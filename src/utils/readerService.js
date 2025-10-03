// A lightweight service to find public-domain book content (HTML/PDF/TXT)
// using the Gutendex (Project Gutenberg) API. Falls back to Open Library later if needed.

const GUTENDEX_API = 'https://gutendex.com/books';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network error ${response.status}`);
  }
  return await response.json();
}

function normalizeAuthorName(name) {
  return (name || '').trim().toLowerCase();
}

function preferFormat(formats) {
  // Prefer readable formats in order
  const preferenceOrder = [
    'text/html; charset=utf-8',
    'text/html',
    'text/plain; charset=utf-8',
    'text/plain',
    'application/epub+zip',
    'application/pdf',
  ];

  for (const key of preferenceOrder) {
    if (formats[key]) {
      return { mime: key, url: formats[key] };
    }
  }

  // Fallback: sometimes html is keyed as 'text/html; charset=us-ascii' etc.
  const htmlKey = Object.keys(formats).find(k => k.startsWith('text/html'));
  if (htmlKey) return { mime: htmlKey, url: formats[htmlKey] };

  // Last resort: pick any http(s) link
  const anyKey = Object.keys(formats).find(k => /^https?:\/\//.test(formats[k] || ''));
  if (anyKey) return { mime: anyKey, url: formats[anyKey] };

  return null;
}

export const ReaderService = {
  /**
   * Find a public-domain book source by title/author using Gutendex
   * @param {{ title?: string, author?: string, gutenbergId?: number }} params
   * @returns {Promise<{ title: string, author: string, url: string, mime: string } | null>}
   */
  async findPublicDomainBook(params) {
    const { title, author, gutenbergId } = params || {};

    if (gutenbergId) {
      // Direct lookup by ID
      const byIdUrl = `${GUTENDEX_API}/?ids=${encodeURIComponent(String(gutenbergId))}`;
      const data = await fetchJson(byIdUrl);
      const book = (data?.results || [])[0];
      if (!book) return null;
      const best = preferFormat(book.formats || {});
      if (!best) return null;
      const primaryAuthor = book.authors?.[0]?.name || 'Unknown Author';
      return { title: book.title, author: primaryAuthor, url: best.url, mime: best.mime };
    }

    // Build multiple query variants to improve match odds
    const cleanTitle = (t) => {
      if (!t) return '';
      let v = String(t).trim();
      // Drop subtitles after colon
      v = v.split(':')[0];
      // Drop parenthetical
      v = v.replace(/\([^\)]*\)/g, '').trim();
      // Collapse whitespace
      v = v.replace(/\s+/g, ' ');
      return v;
    };

    const variants = [];
    const ct = cleanTitle(title);
    if (ct && author) variants.push(`${ct} ${author}`);
    if (ct) variants.push(ct);
    if (title && author) variants.push(`${title} ${author}`);
    if (title) variants.push(title);
    if (author) variants.push(author);

    for (const qRaw of variants) {
      const q = encodeURIComponent(qRaw);
      const url = `${GUTENDEX_API}/?search=${q}`;
      try {
        const data = await fetchJson(url);
        const results = data?.results || [];
        const desiredAuthor = normalizeAuthorName(author);
        const candidates = results
          .map(b => {
            const tScore = ct && b.title ? (b.title.toLowerCase().includes(ct.toLowerCase()) ? 2 : 0) : 0;
            const authorNames = (b.authors || []).map(a => normalizeAuthorName(a.name));
            const aScore = desiredAuthor ? (authorNames.some(n => n.includes(desiredAuthor)) ? 1 : 0) : 0;
            const best = preferFormat(b.formats || {});
            return { b, score: tScore + aScore, best };
          })
          .filter(x => x.best)
          .sort((a, b) => b.score - a.score);

        const chosen = candidates[0];
        if (chosen) {
          const primaryAuthor = chosen.b.authors?.[0]?.name || 'Unknown Author';
          return { title: chosen.b.title, author: primaryAuthor, url: chosen.best.url, mime: chosen.best.mime };
        }
      } catch (_) {
        // Continue to next variant
      }
    }

    return null;
  },
};

export default ReaderService;


