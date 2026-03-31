import { CAPTURE_API_URL, CAPTURE_API_SECRET } from "@/const";
import { SnbpSchoolSummary } from "@/types/snbp";

// In-memory cache
const cache = new Map<string, { data: SnbpSchoolSummary | undefined; expires: number }>();
const TTL_MS = 5 * 60 * 1000; // 5 menit

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSnbpSummary = async (_school: string): Promise<SnbpSchoolSummary | undefined> => {
    const cached = cache.get('summary');
    if (cached && cached.expires > Date.now()) return cached.data;

    const summaryUrl = CAPTURE_API_URL
        ? CAPTURE_API_URL.replace('/capture', '/summary') + '?tahun=2026'
        : '';

    if (!summaryUrl) {
        cache.set('summary', { data: undefined, expires: Date.now() + TTL_MS });
        return undefined;
    }

    try {
        const res  = await fetch(summaryUrl, {
            headers: { 'Authorization': `Bearer ${CAPTURE_API_SECRET}` },
        });
        const data = await res.json() as SnbpSchoolSummary;
        cache.set('summary', { data, expires: Date.now() + TTL_MS });
        return data;
    } catch {
        cache.set('summary', { data: undefined, expires: Date.now() + TTL_MS });
        return undefined;
    }
}