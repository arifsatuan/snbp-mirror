export const SNBP_URL = 'https://pengumuman-snbp.snpmb.id';

// CI4 backend untuk capture hasil SNBP (set di Vercel env vars)
export const CAPTURE_API_URL    = process.env.CAPTURE_API_URL    ?? '';
export const CAPTURE_API_SECRET = process.env.CAPTURE_API_SECRET ?? '';
