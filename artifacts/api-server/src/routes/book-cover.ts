import { Router } from "express";

const router = Router();

const cache = new Map<string, string | null>();
const inFlight = new Set<string>();

async function openLibrarySearch(params: string): Promise<string | null> {
  const url = `https://openlibrary.org/search.json?${params}&limit=5&fields=cover_i`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json() as { docs?: Array<{ cover_i?: number }> };
    const coverId = data?.docs?.find(d => d.cover_i)?.cover_i;
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  } catch {
    return null;
  }
}

async function fetchCoverUrl(title: string, author: string): Promise<string | null> {
  const cleanTitle = title
    .replace(/\s+\d+(?:st|nd|rd|th)?\s*Ed(?:ition)?.*$/i, "")
    .replace(/\s+Vol\.?\s*[\d\-–]+.*$/i, "")
    .replace(/\([^)]*\)/g, "")
    .trim()
    .split(/\s+/).slice(0, 6).join(" ");
  const firstAuthor = author.split(",")[0].trim().split(" ").slice(0, 2).join(" ");

  // Attempt 1: title + author
  if (firstAuthor) {
    const result = await openLibrarySearch(
      `title=${encodeURIComponent(cleanTitle)}&author=${encodeURIComponent(firstAuthor)}`
    );
    if (result) return result;
  }

  // Attempt 2: title only (broader)
  return openLibrarySearch(`title=${encodeURIComponent(cleanTitle)}`);
}

// GET /book-cover?title=...&author=...  (mounted under /api in app.ts)
router.get("/book-cover", async (req, res) => {
  const title = String(req.query.title ?? "").trim();
  const author = String(req.query.author ?? "").trim();
  if (!title) { res.status(400).json({ error: "title required" }); return; }

  const key = `${title}|${author}`;

  if (cache.has(key)) {
    res.json({ url: cache.get(key) });
    return;
  }

  if (inFlight.has(key)) {
    const deadline = Date.now() + 12000;
    while (inFlight.has(key) && Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 100));
    }
    res.json({ url: cache.get(key) ?? null });
    return;
  }

  inFlight.add(key);
  try {
    const coverUrl = await fetchCoverUrl(title, author);
    cache.set(key, coverUrl);
    res.json({ url: coverUrl });
  } catch {
    cache.set(key, null);
    res.json({ url: null });
  } finally {
    inFlight.delete(key);
  }
});

export default router;
