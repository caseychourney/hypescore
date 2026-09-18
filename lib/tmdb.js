export const TMDB_BASE = 'https://api.themoviedb.org/3';

function token() {
  return process.env.TMDB_API_READ_ACCESS_TOKEN || process.env.TMDB_ACCESS_TOKEN || '';
}

export async function tmdbFetch(path, params = {}) {
  const accessToken = token();
  if (!accessToken) throw new Error('TMDB_API_READ_ACCESS_TOKEN is not configured');
  const url = new URL(TMDB_BASE + path);
  Object.entries(params).forEach(([key,value]) => { if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value)); });
  const response = await fetch(url, { headers: { Authorization: 'Bearer ' + accessToken, accept: 'application/json' } });
  if (!response.ok) throw new Error('TMDB request failed: ' + response.status);
  return response.json();
}

export function tmdbImage(path, size = 'w500') {
  return path ? 'https://image.tmdb.org/t/p/' + size + path : null;
}

export function movieSlug(title, id) {
  const base = String(title || 'movie').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
  return base + '-' + id;
}
